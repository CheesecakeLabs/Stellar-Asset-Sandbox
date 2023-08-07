package usecase

import (
	"fmt"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
)

type VaultUseCase struct {
	vRepo VaultRepoInterface
	wRepo WalletRepoInterface
}

func NewVaultUseCase(vRepo VaultRepoInterface, wRepo WalletRepoInterface) *VaultUseCase {
	return &VaultUseCase{
		vRepo: vRepo,
		wRepo: wRepo,
	}
}

func (uc *VaultUseCase) Create(data entity.Vault) (entity.Vault, error) {
	fmt.Print(data.Wallet)
	wallet, err := uc.wRepo.CreateWalletWithKey(data.Wallet)
	if err != nil {
		return entity.Vault{}, fmt.Errorf("VaultUseCase - Create - uc.repo.CreateWalletWithKey(dist): %w", err)
	}
	data.Wallet.Id = wallet.Id

	vault, err := uc.vRepo.CreateVault(data)
	if err != nil {
		return entity.Vault{}, fmt.Errorf("VaultUseCase - Create - uc.repo.CreateVault: %w", err)
	}

	return vault, nil
}

func (uc *VaultUseCase) GetAll() ([]entity.Vault, error) {
	vault, err := uc.vRepo.GetVaults()
	if err != nil {
		return nil, fmt.Errorf("VaultUseCase - GetAll - uc.repo.GetVault: %w", err)
	}

	return vault, nil
}

func (uc *VaultUseCase) GetById(id string) (entity.Vault, error) {
	asset, err := uc.vRepo.GetVaultById(id)
	if err != nil {
		return entity.Vault{}, fmt.Errorf("VaultUseCase - Get - uc.repo.GetVaultById: %w", err)
	}

	return asset, nil
}
