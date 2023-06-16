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
	user, err := uc.userUsecase.repo.GetUserByToken(token)

	pieces := strings.Split(basePath, "/")
	action := pieces[len(pieces)-1]
	isAuthorized, err := uc.repo.Validate(action, user.RoleId)

	if err != nil {
		return false, fmt.Errorf("RolePermissionUseCase - Validate - uc.userUsecase.repo.GetUserByToken: %w", err)
	}

	return isAuthorized, nil
}

func (useCase *RolePermissionUseCase) GetRolePermissions(token string) ([]entity.RolePermissionResponse, error) {
	roles, err := useCase.repo.GetRolePermissions(token)
	if err != nil {
		return nil, fmt.Errorf("RoleUseCase - RolePermissions - uc.repo.GetRolePermissions: %w", err)
	}
	return roles, nil
}
