package usecase

import (
	"fmt"
	"strings"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
)

type RolePermissionUseCase struct {
	repo        RolePermissionRepoInterface
	userUsecase UserUseCase
}

func NewRolePermissionUseCase(r RolePermissionRepoInterface, userUsecase UserUseCase) *RolePermissionUseCase {
	return &RolePermissionUseCase{
		repo:        r,
		userUsecase: userUsecase,
	}
}

func (uc *RolePermissionUseCase) Validate(token string, basePath string) (bool, error) {
	user, err := uc.userUsecase.GetUserByToken(token)
	if err != nil {
		return false, fmt.Errorf("RolePermissionUseCase - Validate - uc.userUsecase.repo.GetUserByToken: %w", err)
	}

	pieces := strings.Split(basePath, "/")
	action := pieces[len(pieces)-1]
	isAuthorized, err := uc.repo.Validate(action, user.RoleId)
	if err != nil {
		return false, fmt.Errorf("RolePermissionUseCase - Validate - uc.repo.Validate: %w", err)
	}

	return isAuthorized, nil
}

func (useCase *RolePermissionUseCase) GetUserPermissions(token string) ([]entity.UserPermissionResponse, error) {
	roles, err := useCase.repo.GetUserPermissions(token)
	if err != nil {
		return nil, fmt.Errorf("RolePermissionUseCase - UserPermissions - uc.repo.GetRolePermissions: %w", err)
	}
	return roles, nil
}

func (useCase *RolePermissionUseCase) GetRolesPermissions() ([]entity.RolePermissionResponse, error) {
	roles, err := useCase.repo.GetRolesPermissions()
	if err != nil {
		return nil, fmt.Errorf("RolePermissionUseCase - RolePermissions - uc.repo.GetRolePermissions: %w", err)
	}
	return roles, nil
}

func (useCase *RolePermissionUseCase) GetPermissions() ([]entity.Permission, error) {
	permissions, err := useCase.repo.GetPermissions()
	if err != nil {
		return nil, fmt.Errorf("RolePermissionUseCase - Permissions - uc.repo.GetPermissions: %w", err)
	}
	return permissions, nil
}

func (uc *RolePermissionUseCase) UpdateRolePermission(data entity.RolePermissionRequest) (entity.RolePermissionRequest, error) {
	if data.IsAdd {
		rolePermission, err := uc.repo.CreateRolePermission(data)
		if err != nil {
			return entity.RolePermissionRequest{}, fmt.Errorf("RolePermissionUseCase - UpdateRolePermission - uc.repo.CreateRolePermission(data): %w", err)
		}

		return rolePermission, nil
	}

	rolePermission, err := uc.repo.DeleteRolePermission(data)
	if err != nil {
		return entity.RolePermissionRequest{}, fmt.Errorf("RolePermissionUseCase - UpdateRolePermission - uc.repo.DeleteRolePermission(data): %w", err)
	}

	return rolePermission, nil
}
