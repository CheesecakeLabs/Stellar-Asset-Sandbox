package usecase

import (
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

func (uc *RolePermissionUseCase) Validate(token string, basePath string) bool {
	user, err := uc.userUsecase.repo.GetUserByToken(token)
	
	pieces := strings.Split(basePath, "/")
	action := pieces[len(pieces) - 1]
	isAuthorized, err := uc.repo.Validate(action, user.RoleId)

	if err != nil {
		return false
	}
	return isAuthorized.IsAuthorized == 1
}
