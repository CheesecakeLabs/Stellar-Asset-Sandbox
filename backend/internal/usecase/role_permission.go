package usecase

import (
	"fmt"
	"strings"
)

type RolePermissionUseCase struct {
	repo RolePermissionRepoInterface
	userUsecase UserUseCase
}

func NewRolePermissionUseCase(r RolePermissionRepoInterface, userUsecase UserUseCase) *RolePermissionUseCase {
	return &RolePermissionUseCase{
		repo: r,
		userUsecase: userUsecase,
	}
}

func (uc *RolePermissionUseCase) Validate(token string, basePath string) (bool, error) {
	user, err := uc.userUsecase.GetUserByToken(token)
	if err != nil {
		return false, fmt.Errorf("RolePermissionUseCase - Validate - uc.userUsecase.repo.GetUserByToken: %w", err)
	}

	pieces := strings.Split(basePath, "/")
	action := pieces[len(pieces) - 1]
	isAuthorized, err := uc.repo.Validate(action, user.RoleId)
	if err != nil {
		return false, fmt.Errorf("RolePermissionUseCase - Validate - uc.repo.Validate: %w", err)
	}

	return isAuthorized, nil
}
