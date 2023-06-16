package usecase_test

import (
	"errors"
	"testing"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/usecase"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/usecase/mocks"
	"github.com/golang/mock/gomock"
	"github.com/stretchr/testify/assert"
)

var validateError = errors.New("error")

type rolePermissionTest struct {
	name string
	roleId int
	mock func()
	res  interface{}
	err  error
}

func TestRolePermissionUseCase_Validate(t *testing.T) {
	t.Helper()

	mockCtl := gomock.NewController(t)
	defer mockCtl.Finish()

	userRepo := mocks.NewMockUserRepo(mockCtl)
	userUseCase := usecase.NewUserUseCase(userRepo, "test")

	roleRepo := mocks.NewMockRolePermissionRepoInterface(mockCtl)
	useCase := usecase.NewRolePermissionUseCase(roleRepo, *userUseCase)
	t.Run("Returns true when user has role", func(t *testing.T) {
		userRepo.EXPECT().GetUserByToken("mytoken").Return(entity.User {
			ID:        "10",
			Name:      "Marcos T",
			RoleId:    1,
		}, nil)
		
		roleRepo.EXPECT().Validate("create-user", 1).Return(true, nil)
	
		isAuthorized, err := useCase.Validate("mytoken", "http://127.0.0.1/v1/create-user")
	
		assert.True(t, isAuthorized)
		assert.NoError(t, err)
	})
	t.Run("Returns false when UserRepo.GetUserByToken fails", func(t *testing.T) {
		userRepo.EXPECT().GetUserByToken("mytoken").Return(entity.User { }, errors.New("Unexpected error"))

		isAuthorized, err := useCase.Validate("mytoken", "http://127.0.0.1/v1/create-user")

		assert.False(t, isAuthorized)
		assert.EqualError(t, err, "RolePermissionUseCase - Validate - uc.userUsecase.repo.GetUserByToken: Unexpected error")
	})
	t.Run("Returns false when RoleRepo.Validate fails", func(t *testing.T) {
		userRepo.EXPECT().GetUserByToken("mytoken").Return(entity.User {
			ID:        "10",
			Name:      "Marcos T",
			RoleId:    2,
		}, nil)
		roleRepo.EXPECT().Validate("create-user", 2).Return(false, errors.New("Unexpected error"))

		isAuthorized, err := useCase.Validate("mytoken", "http://127.0.0.1/v1/create-user")

		assert.False(t, isAuthorized)
		assert.EqualError(t, err, "RolePermissionUseCase - Validate - uc.repo.Validate: Unexpected error")
	})
	t.Run("Returns false when user has no role", func(t *testing.T) {
		userRepo.EXPECT().GetUserByToken("mytoken").Return(entity.User {
			ID:        "10",
			Name:      "Marcos T",
			RoleId:    1,
		}, nil)
		
		roleRepo.EXPECT().Validate("create-user", 1).Return(false, nil)
	
		isAuthorized, err := useCase.Validate("mytoken", "http://127.0.0.1/v1/create-user")
	
		assert.False(t, isAuthorized)
		assert.NoError(t, err)
	})
}
