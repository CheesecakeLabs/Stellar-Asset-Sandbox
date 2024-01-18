package usecase

import (
	"fmt"
	"strconv"
	"time"

	"github.com/CheesecakeLabs/token-factory-v2/backend/config"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
)

type AssetUseCase struct {
	aRepo          AssetRepoInterface
	wRepo          WalletRepoInterface
	tInt           TomlInterface
	tRepo          TomlRepoInterface
	cfg            config.Horizon
	storageService AssetServiceInterface
}

func NewAssetUseCase(aRepo AssetRepoInterface, wRepo WalletRepoInterface, tInt TomlInterface, tRepo TomlRepoInterface, cfg config.Horizon, storageService AssetServiceInterface) *AssetUseCase {
	return &AssetUseCase{
		aRepo:          aRepo,
		wRepo:          wRepo,
		tInt:           tInt,
		tRepo:          tRepo,
		cfg:            cfg,
		storageService: storageService,
	}
}

func (uc *AssetUseCase) Create(data entity.Asset, imageBytes []byte) (entity.Asset, error) {
	issuer, err := uc.wRepo.CreateWalletWithKey(data.Issuer)
	if err != nil {
		return entity.Asset{}, fmt.Errorf("AssetUseCase - Create - uc.repo.CreateWalletWithKey(issuer): %w", err)
	}
	data.Issuer.Id = issuer.Id

	dist, err := uc.wRepo.CreateWalletWithKey(data.Distributor)
	if err != nil {
		return entity.Asset{}, fmt.Errorf("AssetUseCase - Create - uc.repo.CreateWalletWithKey(dist): %w", err)
	}
	data.Distributor.Id = dist.Id

	// Upload image to S3 if exists
	if len(imageBytes) > 0 {
		s3Name := fmt.Sprint(data.Code, "_", data.Issuer.Key.PublicKey)
		assetImage, err := uc.storageService.UploadFile(s3Name, imageBytes)
		if err != nil {
			return entity.Asset{}, fmt.Errorf("AssetUseCase - Create - uc.awsService.UploadAssetImage: %w", err)
		}
		data.Image = assetImage
	}

	asset, err := uc.aRepo.CreateAsset(data)
	if err != nil {
		return entity.Asset{}, fmt.Errorf("AssetUseCase - Create - uc.repo.CreateWallet: %w", err)
	}

	return asset, nil
}

func (uc *AssetUseCase) Get(code string) (entity.Asset, error) {
	asset, err := uc.aRepo.GetAssetByCode(code)
	if err != nil {
		return entity.Asset{}, fmt.Errorf("AssetUseCase - Get - uc.repo.GetAssetByCode: %w", err)
	}

	return asset, nil
}

func (uc *AssetUseCase) GetById(id string) (entity.Asset, error) {
	asset, err := uc.aRepo.GetAssetById(id)
	if err != nil {
		return entity.Asset{}, fmt.Errorf("AssetUseCase - Get - uc.repo.GetAssetByCode: %w", err)
	}

	return asset, nil
}

func (uc *AssetUseCase) GetAll(filter entity.AssetFilter) ([]entity.Asset, error) {
	assets, err := uc.aRepo.GetAssets(filter)
	if err != nil {
		return nil, fmt.Errorf("AssetUseCase - GetAll - uc.repo.GetAssets: %w", err)
	}

	return assets, nil
}

func (uc *AssetUseCase) UploadImage(data entity.Asset, imageBytes []byte) error {
	timestamp := time.Now().Format("20060102_150405")
	s3Name := fmt.Sprintf("%s_%s_%s", data.Code, data.Issuer.Key.PublicKey, timestamp)

	assetImage, err := uc.storageService.UploadFile(s3Name, imageBytes)
	if err != nil {
		return fmt.Errorf("AssetUseCase - Create - uc.awsService.UploadAssetImage: %w", err)
	}

	err = uc.aRepo.StoreAssetImage(strconv.Itoa(data.Id), assetImage)
	if err != nil {
		return fmt.Errorf("ImageUseCase - UploadImage - uc.aRepo.StoreAssetImage: %w", err)
	}
	return nil
}

func (uc *AssetUseCase) GetImage(assetId string) ([]byte, error) {
	image, err := uc.aRepo.GetAssetImage(assetId)
	if err != nil {
		return nil, fmt.Errorf("ImageUseCase - GetImage - uc.aRepo.GetAssetImage: %w", err)
	}
	return image, nil
}

func (uc *AssetUseCase) CreateToml(req entity.TomlData) (string, error) {
	tomlCreated, err := uc.tInt.GenerateToml(req, uc.cfg)
	if err != nil {
		return "", fmt.Errorf("AssetUseCase - CreateToml - uc.tInt.GenerateToml: %w", err)
	}

	// Save the new toml data in the database
	_, err = uc.tRepo.CreateToml(tomlCreated)
	if err != nil {
		return "", fmt.Errorf("AssetUseCase - UpdateToml - uc.repo.CreateToml: %w", err)
	}

	return tomlCreated, err
}

func (uc *AssetUseCase) RetrieveToml() (string, error) {
	toml, err := uc.tRepo.GetToml()
	if err != nil {
		return "", fmt.Errorf("AssetUseCase - RetrieveToml - uc.repo.GetToml: %w", err)
	}

	return toml, err
}

func (uc *AssetUseCase) UpdateToml(updatedToml entity.TomlData) (string, error) {
	// Get old toml data in the database
	oldTomlDb, err := uc.tRepo.GetToml()
	if err != nil {
		return "", fmt.Errorf("AssetUseCase - RetrieveToml - uc.repo.GetToml: %w", err)
	}

	oldTomParsed, err := uc.tInt.RetrieveToml(oldTomlDb) // Parse old toml data
	if err != nil {
		return "", fmt.Errorf("AssetUseCase - UpdateToml - uc.tInt.GenerateToml: %w", err)
	}

	// Update old toml data with new data
	newTomlParsed, err := uc.tInt.UpdateTomlData(oldTomParsed, updatedToml)
	if err != nil {
		return "", fmt.Errorf("AssetUseCase - UpdateToml - uc.tInt.GenerateToml: %w", err)
	}

	// Parse the new toml data in a TOML string
	tomlCreated, err := uc.tInt.GenerateToml(newTomlParsed, uc.cfg)
	if err != nil {
		return "", fmt.Errorf("AssetUseCase - CreateToml - uc.tInt.GenerateToml: %w", err)
	}

	// Save the new toml data in the database
	_, err = uc.tRepo.CreateToml(tomlCreated)
	if err != nil {
		return "", fmt.Errorf("AssetUseCase - UpdateToml - uc.repo.CreateToml: %w", err)
	}

	return tomlCreated, err
}

func (uc *AssetUseCase) GetTomlData() (entity.TomlData, error) {
	tomlDb, err := uc.tRepo.GetToml()
	if err != nil {
		return entity.TomlData{}, fmt.Errorf("AssetUseCase - GetTomlData - uc.repo.GetToml: %w", err)
	}

	tomParsed, err := uc.tInt.RetrieveToml(tomlDb) // Parse old toml data
	if err != nil {
		return entity.TomlData{}, fmt.Errorf("AssetUseCase - GetTomlData - uc.tInt.RetrieveToml: %w", err)
	}

	return tomParsed, err
}

func (uc *AssetUseCase) UpdateContractId(assetId string, contractId string) error {
	err := uc.aRepo.UpdateContractId(assetId, contractId)
	if err != nil {
		return fmt.Errorf("AssetUseCase - UpdateContractId - uc.aRepo.UpdateContractId: %w", err)
	}
	return nil
}

func (uc *AssetUseCase) GetPaginatedAssets(page int, limit int, filter entity.AssetFilter) ([]entity.Asset, int, error) {
	assets, totalPages, err := uc.aRepo.GetPaginatedAssets(page, limit, filter)
	if err != nil {
		return nil, 0, fmt.Errorf("AssetUseCase - GetPaginated - uc.repo.GetPaginated: %w", err)
	}

	return assets, totalPages, nil
}
