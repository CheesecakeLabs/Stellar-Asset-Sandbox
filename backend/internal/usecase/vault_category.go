package usecase

import (
	"fmt"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
)

type VaultCategoryUseCase struct {
	vcRepo VaultCategoryRepoInterface
}

func NewVaultCategoryUseCase(vcRepo VaultCategoryRepoInterface) *VaultCategoryUseCase {
	return &VaultCategoryUseCase{
		vcRepo: vcRepo,
	}
}

func (uc *VaultCategoryUseCase) Create(data entity.VaultCategory) (entity.VaultCategory, error) {
	vaultCategory, err := uc.vcRepo.CreateVaultCategory(data)
	if err != nil {
		return entity.VaultCategory{}, fmt.Errorf("VaultCategoryUseCase - Create - uc.repo.CreateVaultCategory: %w", err)
	}

	return vaultCategory, nil
}

func (uc *VaultCategoryUseCase) GetAll() ([]entity.VaultCategory, error) {
	vaultCategories, err := uc.vcRepo.GetVaultCategories()
	if err != nil {
		return nil, fmt.Errorf("VaultCategoryUseCase - GetAll - uc.repo.GetVaultCategories: %w", err)
	}

	return vaultCategories, nil
}
