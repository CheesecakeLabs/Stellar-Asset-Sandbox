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
	contract, err := uc.cRepo.GetContractById(id)
	if err != nil {
		return entity.Contract{}, fmt.Errorf("ContractUseCase - GetById - uc.repo.GetContractById: %w", err)
	}

	return contract, nil
}

func (uc *ContractUseCase) GetPaginatedContracts(page int, limit int) ([]entity.Contract, error) {
	contracts, err := uc.cRepo.GetPaginatedContracts(page, limit)
	if err != nil {
		return nil, fmt.Errorf("ContractUseCase - GetPaginatedContracts - uc.repo.GetPaginatedContracts: %w", err)
	}

	return contracts, nil
}

func (uc *ContractUseCase) GetHistory(userId int, contractId int) ([]entity.ContractHistory, error) {
	contractsHistory, err := uc.cRepo.GetHistory(userId, contractId)
	if err != nil {
		return nil, fmt.Errorf("ContractUseCase - GetHistory - uc.repo.GetHistory: %w", err)
	}

	return contractsHistory, nil
}

func (uc *ContractUseCase) AddContractHistory(contractHistory entity.ContractHistory) (entity.ContractHistory, error) {
	contractsHistory, err := uc.cRepo.AddContractHistory(contractHistory)
	if err != nil {
		return entity.ContractHistory{}, fmt.Errorf("ContractUseCase - AddContractHistory - uc.repo.AddContractHistory: %w", err)
	}

	return contractsHistory, nil
}

func (uc *ContractUseCase) UpdateContractHistory(contractHistory entity.ContractHistory) (entity.ContractHistory, error) {
	contractHistory, err := uc.cRepo.UpdateContractHistory(contractHistory)
	if err != nil {
		return entity.ContractHistory{}, fmt.Errorf("ContractUseCase - UpdateContractHistory - uc.repo.UpdateContractHistory: %w", err)
	}

	return contractHistory, nil
}
