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

func (useCase *RoleUseCase) CreateRole(data entity.RoleRequest) (entity.RoleRequest, error) {
	role, err := useCase.repo.CreateRole(data)
	if err != nil {
		return entity.RoleRequest{}, fmt.Errorf("RoleUseCase - CreateRole - uc.repo.CreateRole: %w", err)
	}
	return role, nil
}

func (useCase *RoleUseCase) UpdateRole(data entity.Role) (entity.Role, error) {
	role, err := useCase.repo.UpdateRole(data)
	if err != nil {
		return entity.Role{}, fmt.Errorf("RoleUseCase - UpdateRole - uc.repo.UpdateRole: %w", err)
	}
	return role, nil
}

func (useCase *RoleUseCase) DeleteRole(data entity.RoleDelete) (entity.RoleDelete, error) {
	role, err := useCase.repo.DeleteRole(data)
	if err != nil {
		return entity.RoleDelete{}, fmt.Errorf("RoleUseCase - DeleteRole - uc.repo.DeleteRole: %w", err)
	}
	return role, nil
}

func (useCase *RoleUseCase) GetRoleById(id int) (entity.Role, error) {
	role, err := useCase.repo.GetRoleById(id)
	if err != nil {
		return entity.Role{}, fmt.Errorf("RoleUseCase - GetRoleById - uc.repo.GetRoleById: %w", err)
	}
	return role, nil
}

func (useCase *RoleUseCase) GetSuperAdminRole() (entity.Role, error) {
	role, err := useCase.repo.GetSuperAdminRole()
	if err != nil {
		return entity.Role{}, fmt.Errorf("RoleUseCase - GetSuperAdminRole - uc.repo.GetSuperAdminRole: %w", err)
	}
	return role, nil
}


func (useCase *RoleUseCase) IsUserSuperAdmin(token string) (bool, error) {
	role, err := useCase.repo.GetSuperAdminRole()
	if err != nil {
		return false, fmt.Errorf("RoleUseCase - GetSuperAdminRole - uc.repo.GetSuperAdminRole: %w", err)
	}
	if (role == entity.Role{}) {
		return false, nil
	}
	return true, nil
}
