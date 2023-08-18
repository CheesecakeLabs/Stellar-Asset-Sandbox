package usecase_test

import (
	"errors"
	"fmt"
	"testing"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/usecase"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/usecase/mocks"
	"github.com/golang/mock/gomock"
	"github.com/stretchr/testify/require"
)

var errInternalServErr = errors.New("internal server error")

type userTest struct {
	name string
	mock func()
	res  interface{}
	err  error
}

func user(t *testing.T) (*usecase.UserUseCase, *mocks.MockUserRepo) {
	t.Helper()

	mockCtl := gomock.NewController(t)
	defer mockCtl.Finish()

	repo := mocks.NewMockUserRepo(mockCtl)

	useCase := usecase.NewUserUseCase(repo, "test")

	return useCase, repo
}

func TestUserUseCase_GetUser(t *testing.T) {
	userCase, repo := user(t)

	tests := []userTest{
		{
			name: "empty result",
			mock: func() {
				repo.EXPECT().
					GetUser("empty result").
					Return(entity.User{}, nil)
			},
			res: entity.User{},
			err: nil,
		},
		{
			name: "result with error",
			mock: func() {
				repo.EXPECT().
					GetUser("result with error").
					Return(entity.User{}, errInternalServErr)
			},
			res: entity.User{},
			err: errInternalServErr,
		},
		{
			name: "result without error",
			mock: func() {
				repo.EXPECT().
					GetUser("result without error").
					Return(entity.User{
						Name:     "test",
						Password: "test",
					}, nil)
			},
			res: entity.User{
				Name:     "test",
				Password: "test",
			},
		},
	}
	for _, tc := range tests {
		tc := tc
		t.Run(tc.name, func(t *testing.T) {
			tc.mock()

			res, err := userCase.Detail(tc.name)

			require.Equal(t, res, tc.res)
			require.ErrorIs(t, err, tc.err)
		})
	}
}

func TestUserUseCase_CreateUser(t *testing.T) {
	userCase, repo := user(t)

	users := []entity.User{
		{
			Name: "user_invalid",
		},
		// {
		// 	Name:     "user_valid",
		// 	Password: "password",
		// },
	}

	tests := []userTest{
		{
			name: "result with error",
			mock: func() {
				repo.EXPECT().
					CreateUser(users[0]).
					Return(fmt.Errorf("password is empty"))
			},
			err: fmt.Errorf("password is empty"),
		},
		// {
		// 	name: "result without error",
		// 	mock: func() {
		// 		repo.EXPECT().
		// 			CreateUser(users[0]).
		// 			Return(nil)
		// 	},
		// 	err: nil,
		// },
	}

	for i, tc := range tests {
		tc := tc
		t.Run(tc.name, func(t *testing.T) {
			tc.mock()

			err := userCase.CreateUser(users[i])

			require.Equal(t, err, tc.err)
		})
	}
}
