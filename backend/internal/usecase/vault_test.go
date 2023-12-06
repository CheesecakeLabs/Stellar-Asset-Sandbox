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
		VaultCategory: &entity.VaultCategory{
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
		VaultCategory: &entity.VaultCategory{
			Id:   2,
			Name: "Another Category",
		},
	}

	tests := []testVault{
		{
			name: "list - two vaults",
			req:  nil,
			mock: func() {
				vr.EXPECT().GetVaults(true).Return([]entity.Vault{vault1, vault2}, nil)
			},
			res: []entity.Vault{vault1, vault2},
			err: nil,
		},
		{
			name: "list - empty",
			req:  nil,
			mock: func() {
				vr.EXPECT().GetVaults(true).Return([]entity.Vault{}, nil)
			},
			res: []entity.Vault{},
			err: nil,
		},
		{
			name: "list - database error",
			req:  nil,
			mock: func() {
				vr.EXPECT().GetVaults(true).Return(nil, dbError)
			},
			res: []entity.Vault(nil),
			err: dbError,
		},
	}

	for _, tc := range tests {
		tc := tc
		t.Run(tc.name, func(t *testing.T) {
			tc.mock()

			res, err := u.GetAll(true)

			require.EqualValues(t, tc.res, res)
			if tc.err == nil {
				require.EqualValues(t, err, tc.err)
			} else {
				require.ErrorContains(t, err, dbError.Error())
			}
		})
	}
}

func TestVaultUseCaseGetById(t *testing.T) {
	u, vr, _, _ := vault(t)

	vault1 := entity.Vault{
		Id:   1,
		Name: "Treasury",
		Wallet: entity.Wallet{
			Type: entity.SponsorType,
		},
		VaultCategory: &entity.VaultCategory{
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
		VaultCategory: &entity.VaultCategory{
			Id:   2,
			Name: "Another Category",
		},
	}

	tests := []testVault{
		{
			name: "get - vault 1- Sucess",
			req:  1,
			mock: func() {
				vr.EXPECT().GetVaultById(1).Return(vault1, nil)
			},
			res: vault1,
			err: nil,
		},
		{
			name: "get - vault 2 - Sucess",
			req:  2,
			mock: func() {
				vr.EXPECT().GetVaultById(2).Return(vault2, nil)
			},
			res: vault2,
			err: nil,
		},
		{
			name: "get - vault 3 - Not Found",
			req:  3,
			mock: func() {
				vr.EXPECT().GetVaultById(3).Return(entity.Vault{}, vaultDbError)
			},
			res: entity.Vault{},
			err: vaultDbError,
		},
	}
	for _, tc := range tests {
		tc := tc
		t.Run(tc.name, func(t *testing.T) {
			tc.mock()

			res, err := u.GetById(tc.req.(int))

			require.EqualValues(t, tc.res, res)
			if tc.err == nil {
				require.EqualValues(t, err, tc.err)
			} else {
				require.ErrorContains(t, err, dbError.Error())
			}
		})
	}
}

func TestVaultUseCaseCreate(t *testing.T) {
	u, vr, wr, _ := vault(t)

	vault := entity.Vault{
		Id:   1,
		Name: "Treasury",
		Wallet: entity.Wallet{
			Type: entity.SponsorType,
		},
		VaultCategory: &entity.VaultCategory{
			Id:   1,
			Name: "Some Category",
		},
	}

	tests := []testVault{
		{
			name: "create - vault - Sucess",
			req:  vault,
			mock: func() {
				wr.EXPECT().CreateWalletWithKey(vault.Wallet).Return(vault.Wallet, nil)
				vr.EXPECT().CreateVault(vault).Return(vault, nil)
			},
			res: vault,
			err: nil,
		},
		{
			name: "create - vault - Database Error",
			req:  vault,
			mock: func() {
				wr.EXPECT().CreateWalletWithKey(vault.Wallet).Return(vault.Wallet, nil)
				vr.EXPECT().CreateVault(vault).Return(entity.Vault{}, vaultDbError)
			},
			res: entity.Vault{},
			err: vaultDbError,
		},
		{
			name: "create - vault - Wallet Error",
			req:  vault,
			mock: func() {
				wr.EXPECT().CreateWalletWithKey(vault.Wallet).Return(entity.Wallet{}, walletDbError)
			},
			res: entity.Vault{},
			err: walletDbError,
		},
	}

	for _, tc := range tests {
		tc := tc
		t.Run(tc.name, func(t *testing.T) {
			tc.mock()

			res, err := u.Create(tc.req.(entity.Vault))

			require.EqualValues(t, tc.res, res)
			if tc.err == nil {
				require.EqualValues(t, err, tc.err)
			} else {
				require.ErrorContains(t, err, dbError.Error())
			}
		})
	}
}
