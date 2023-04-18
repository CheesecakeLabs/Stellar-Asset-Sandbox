package usecase_test

import (
	"context"
	"errors"
	"testing"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/usecase"
	"github.com/golang/mock/gomock"
	"github.com/stretchr/testify/require"
)

var errInternalServErr = errors.New("internal server error")

type test struct {
	name string
	mock func()
	res  interface{}
	err  error
}

func user(t *testing.T) (*usecase.UserUseCase, *MockUserRepo) {
	t.Helper()

	mockCtl := gomock.NewController(t)
	defer mockCtl.Finish()

	repo := NewMockUserRepo(mockCtl)

	useCase := usecase.NewUserUseCase(repo, "test")

	return useCase, repo
}

func TestUserUseCase_GetUser(t *testing.T) {
	userCase, repo := user(t)

	tests := []test{
		{
			name: "empty result",
			mock: func() {
				repo.EXPECT().
					GetUser("context.Background(").
					Return(entity.User{
						ID:   "test",
						Name: "test",
					}, nil)
			},
			res: entity.User{
				ID:   "test",
				Name: "test",
			},
			err: nil,
		},
		{
			name: "result with error",
			mock: func() {
				repo.EXPECT().
					GetUser(context.Background()).
					Return(entity.User{
						ID:   "test",
						Name: "test",
					}, errInternalServErr)
			},
			res: entity.User{
				ID:   "test",
				Name: "test",
			},
			err: errInternalServErr,
		},
	}

	for _, tc := range tests {
		tc := tc

		t.Run(tc.name, func(t *testing.T) {
			tc.mock()

			res, err := userCase.Detail("test")

			require.Equal(t, res, tc.res)
			require.ErrorIs(t, err, tc.err)
		})
	}
}
