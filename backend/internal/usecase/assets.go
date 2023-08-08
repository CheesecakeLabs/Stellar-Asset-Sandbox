package usecase

import (
	"fmt"

	"github.com/CheesecakeLabs/token-factory-v2/backend/config"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
)

type AssetUseCase struct {
	aRepo AssetRepoInterface
	wRepo WalletRepoInterface
	tRepo TomlInterface
	cfg   config.Horizon
}

func NewAssetUseCase(aRepo AssetRepoInterface, wRepo WalletRepoInterface, tRepo TomlInterface, cfg config.Horizon) *AssetUseCase {
	return &AssetUseCase{
		aRepo: aRepo,
		wRepo: wRepo,
		tRepo: tRepo,
		cfg:   cfg,
	}
}

func (uc *AssetUseCase) Create(data entity.Asset) (entity.Asset, error) {
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

func (uc *AssetUseCase) GetAll() ([]entity.Asset, error) {
	assets, err := uc.aRepo.GetAssets()
	if err != nil {
		return nil, fmt.Errorf("AssetUseCase - GetAll - uc.repo.GetAssets: %w", err)
	}

	return assets, nil
}

func (uc *AssetUseCase) CreateToml(req entity.TomlData) (string, error) {
	toml, err := uc.tRepo.GenerateToml(req, uc.cfg)

	return toml, err
}

func (uc *AssetUseCase) RetrieveToml(code string) (string, error) {
	toml, err := uc.tRepo.RetrieveToml(code)

	return toml, err
}
