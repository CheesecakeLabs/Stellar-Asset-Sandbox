package usecase

import (
	"fmt"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
)

type RoleUseCase struct {
	repo RoleRepoInterface
}

func NewRoleUseCase(r RoleRepoInterface) *RoleUseCase {
	return &RoleUseCase{
		repo: r,
	}
}

func (useCase *RoleUseCase) List() ([]entity.Role, error) {
	roles, err := useCase.repo.GetRoles()
	if err != nil {
		return nil, fmt.Errorf("RoleUseCase - List - uc.repo.List: %w", err)
	}
	return roles, nil
}