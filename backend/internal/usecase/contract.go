package usecase

import (
	"fmt"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
)

type ContractUseCase struct {
	cRepo ContractRepoInterface
}

func NewContractUseCase(cRepo ContractRepoInterface) *ContractUseCase {
	return &ContractUseCase{
		cRepo: cRepo,
	}
}

func (uc *ContractUseCase) Create(data entity.Contract) (entity.Contract, error) {
	contract, err := uc.cRepo.CreateContract(data)
	if err != nil {
		return entity.Contract{}, fmt.Errorf("ContractUseCase - Create - uc.repo.CreateContract: %w", err)
	}

	return contract, nil
}

func (uc *ContractUseCase) GetAll() ([]entity.Contract, error) {
	contracts, err := uc.cRepo.GetContracts()
	if err != nil {
		return nil, fmt.Errorf("ContractUseCase - GetAll - uc.repo.GetContract: %w", err)
	}

	return contracts, nil
}

func (uc *ContractUseCase) GetById(id string) (entity.Contract, error) {
	asset, err := uc.cRepo.GetContractById(id)
	if err != nil {
		return entity.Contract{}, fmt.Errorf("ContractUseCase - Get - uc.repo.GetContractById: %w", err)
	}

	return asset, nil
}
