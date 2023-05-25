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

func (uc *AssetUseCase) Mint(data entity.Asset) (entity.Asset, error) {
	asset, err := uc.aRepo.GetAssetByCode(data.Code)
	if err != nil {
		return entity.Asset{}, fmt.Errorf("AssetUseCase - Mint - uc.repo.GetAssetByCode: %w", err)
	}

	asset, err = uc.aRepo.MintAsset(asset, data.Amount)
	if err != nil {
		return entity.Asset{}, fmt.Errorf("AssetUseCase - Mint - uc.repo.MintAsset: %w", err)
	}

	return asset, nil
}
