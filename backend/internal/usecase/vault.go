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
	vault, err := uc.vRepo.CreateVault(data)
	if err != nil {
		return entity.Vault{}, fmt.Errorf("VaultUseCase - Create - uc.repo.CreateVault: %w", err)
	}

	return vault, nil
}

func (uc *VaultUseCase) GetAll(isAll bool) ([]entity.Vault, error) {
	vault, err := uc.vRepo.GetVaults(isAll)
	if err != nil {
		return nil, fmt.Errorf("VaultUseCase - GetAll - uc.repo.GetVault: %w", err)
	}

	return vault, nil
}

func (uc *VaultUseCase) UpdateVault(data entity.Vault) (entity.Vault, error) {
	vault, err := uc.vRepo.UpdateVault(data)
	if err != nil {
		return entity.Vault{}, fmt.Errorf("VaultUseCase - UpdateVault - uc.repo.UpdateVault: %w", err)
	}

	return vault, nil
}

func (uc *VaultUseCase) GetById(id int) (entity.Vault, error) {
	asset, err := uc.vRepo.GetVaultById(id)
	if err != nil {
		return entity.Vault{}, fmt.Errorf("VaultUseCase - Get - uc.repo.GetVaultById: %w", err)
	}

	return asset, nil
}

func (uc *VaultUseCase) DeleteVault(data entity.Vault) (entity.Vault, error) {
	vault, err := uc.vRepo.DeleteVault(data)
	if err != nil {
		return entity.Vault{}, fmt.Errorf("VaultUseCase - DeleteVault - uc.repo.DeleteVault: %w", err)
	}

	return vault, nil
}

func (uc *VaultUseCase) GetPaginatedVaults(page, limit int) ([]entity.Vault, int, error) {
	vault, totalPages, err := uc.vRepo.GetPaginatedVaults(page, limit)
	if err != nil {
		return nil, 0, fmt.Errorf("VaultUseCase - GetPaginatedVaults - uc.repo.GetPaginatedVaults: %w", err)
	}

	return vault, totalPages, nil
}
