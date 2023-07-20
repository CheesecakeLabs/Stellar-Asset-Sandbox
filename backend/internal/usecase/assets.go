package usecase

import (
	"fmt"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
)

type AssetUseCase struct {
	aRepo AssetRepoInterface
	wRepo WalletRepoInterface
}

func NewAssetUseCase(aRepo AssetRepoInterface, wRepo WalletRepoInterface) *AssetUseCase {
	return &AssetUseCase{
		aRepo: aRepo,
		wRepo: wRepo,
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

	wallet, err := uc.wRepo.GetWallet(asset.Issuer.Id)
	if err != nil {
		return entity.Asset{}, fmt.Errorf("AssetUseCase - Get - uc.repo.GetWallet: %w", err)
	}

	wallet.Key, err = uc.wRepo.GetKeyByWallet(wallet.Id)
	if err != nil {
		return entity.Asset{}, fmt.Errorf("WalletUseCase - Get - uc.repo.GetKey: %w", err)
	}

	asset.Issuer = wallet

	asset.Distributor, err = uc.wRepo.GetWallet(asset.Distributor.Id)
	if err != nil {
		return entity.Asset{}, fmt.Errorf("AssetUseCase - Get - uc.repo.GetWallet: %w", err)
	}

	asset.Distributor.Key, err = uc.wRepo.GetKeyByWallet(asset.Distributor.Id)
	if err != nil {
		return entity.Asset{}, fmt.Errorf("WalletUseCase - Get - uc.repo.GetKey: %w", err)
	}
	fmt.Println("asset", asset)
	return asset, nil
}

func (uc *AssetUseCase) GetAll() ([]entity.Asset, error) {
	assets, err := uc.aRepo.GetAssets()
	if err != nil {
		return nil, fmt.Errorf("AssetUseCase - GetAll - uc.repo.GetAssets: %w", err)
	}

	return assets, nil
}
