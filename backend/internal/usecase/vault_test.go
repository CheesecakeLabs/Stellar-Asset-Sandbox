package usecase_test

import (
	"errors"
	"testing"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/usecase"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/usecase/mocks"
	"github.com/golang/mock/gomock"
	"github.com/stretchr/testify/require"
)

type testVault struct {
	name string
	mock func()
	req  interface{}
	res  interface{}
	err  error
}

var vaultDbError = errors.New("vault database error")

func vault(t *testing.T) (*usecase.VaultUseCase, *mocks.MockVaultRepoInterface, *mocks.MockWalletRepoInterface, *mocks.MockVaultCategoryRepoInterface) {
	t.Helper()

	mockCtl := gomock.NewController(t)
	defer mockCtl.Finish()

	vaultRepo := mocks.NewMockVaultRepoInterface(mockCtl)
	walletRepo := mocks.NewMockWalletRepoInterface(mockCtl)
	vaultCategoryRepo := mocks.NewMockVaultCategoryRepoInterface(mockCtl)

	u := usecase.NewVaultUseCase(vaultRepo, walletRepo)

	return u, vaultRepo, walletRepo, vaultCategoryRepo
}

func TestVaultUseCaseList(t *testing.T) {
	u, vr, _, _ := vault(t)

	vault1 := entity.Vault{
		Id:   1,
		Name: "Treasury",
		Wallet: entity.Wallet{
			Type: entity.SponsorType,
		},
		VaultCategory: entity.VaultCategory{
			Id:   1,
			Name: "Some Category",
		},
	}

	vault2 := entity.Vault{
		Id:   2,
		Name: "Safe",
		Wallet: entity.Wallet{
			Type: entity.IssuerType,
		},
		VaultCategory: entity.VaultCategory{
			Id:   2,
			Name: "Another Category",
		},
	}

	tests := []testVault{
		{
			name: "list - two vaults",
			req:  nil,
			mock: func() {
				vr.EXPECT().GetVaults().Return([]entity.Vault{vault1, vault2}, nil)
			},
			res: []entity.Vault{vault1, vault2},
			err: nil,
		},
		{
			name: "list - empty",
			req:  nil,
			mock: func() {
				vr.EXPECT().GetVaults().Return([]entity.Vault{}, nil)
			},
			res: []entity.Vault{},
			err: nil,
		},
		{
			name: "list - database error",
			req:  nil,
			mock: func() {
				vr.EXPECT().GetVaults().Return(nil, dbError)
			},
			res: []entity.Vault(nil),
			err: dbError,
		},
	}

	for _, tc := range tests {
		tc := tc
		t.Run(tc.name, func(t *testing.T) {
			tc.mock()

			res, err := u.GetAll()

			require.EqualValues(t, tc.res, res)
			if tc.err == nil {
				require.EqualValues(t, err, tc.err)
			} else {
				require.ErrorContains(t, err, dbError.Error())
			}
		})
	}
}
