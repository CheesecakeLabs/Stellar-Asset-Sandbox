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

type testWallet struct {
	name string
	mock func()
	req  interface{}
	res  interface{}
	err  error
}

var dbError = errors.New("database error")
var walletDbError = errors.New("wallet database error")
var keyDbError = errors.New("key database error")

func wallet(t *testing.T) (*usecase.WalletUseCase, *mocks.MockWalletRepoInterface) {
	t.Helper()

	mockCtl := gomock.NewController(t)
	defer mockCtl.Finish()

	r := mocks.NewMockWalletRepoInterface(mockCtl)
	u := usecase.NewWalletUseCase(r)

	return u, r
}

func TestWalletUseCaseList(t *testing.T) {
	u, r := wallet(t)

	wallet1 := entity.Wallet{
		Id:   1,
		Type: entity.SponsorType,
	}
	wallet2 := entity.Wallet{
		Id:   1,
		Type: entity.IssuerType,
		Key: entity.Key{
			Id: 3,
		},
	}
	tests := []testWallet{
		{
			name: "list - two wallets",
			req:  entity.SponsorType,
			mock: func() {
				r.EXPECT().GetWallets(entity.SponsorType).Return([]entity.Wallet{wallet1, wallet2}, nil)
			},
			res: []entity.Wallet{wallet1, wallet2},
			err: nil,
		},
		{
			name: "list - empty",
			req:  entity.SponsorType,
			mock: func() {
				r.EXPECT().GetWallets(entity.SponsorType).Return([]entity.Wallet{}, nil)
			},
			res: []entity.Wallet{},
			err: nil,
		},
		{
			name: "list - database error",
			req:  entity.SponsorType,
			mock: func() {
				r.EXPECT().GetWallets(entity.SponsorType).Return(nil, dbError)
			},
			res: []entity.Wallet(nil),
			err: dbError,
		},
	}

	for _, tc := range tests {
		tc := tc
		t.Run(tc.name, func(t *testing.T) {
			tc.mock()

			res, err := u.List(tc.req.(string))

			require.EqualValues(t, tc.res, res)
			if tc.err == nil {
				require.EqualValues(t, err, tc.err)
			} else {
				require.ErrorContains(t, err, dbError.Error())
			}
		})
	}

}

func TestWalletUseCasGet(t *testing.T) {
	u, r := wallet(t)

	wallet := entity.Wallet{
		Id:   12,
		Type: entity.IssuerType,
		Key: entity.Key{
			Id:        3,
			PublicKey: "key",
		},
	}
	tests := []testWallet{
		{
			name: "get - success",
			req:  12,
			mock: func() {
				r.EXPECT().GetWallet(12).Return(wallet, nil)
				r.EXPECT().GetKeyByWallet(12).Return(wallet.Key, nil)
			},
			res: wallet,
			err: nil,
		},
		{
			name: "get - wallet database error",
			req:  12,
			mock: func() {
				r.EXPECT().GetWallet(12).Return(entity.Wallet{}, walletDbError)
			},
			res: entity.Wallet{},
			err: walletDbError,
		},
		{
			name: "get - key database error",
			req:  12,
			mock: func() {
				r.EXPECT().GetWallet(12).Return(wallet, nil)
				r.EXPECT().GetKeyByWallet(12).Return(entity.Key{}, keyDbError)
			},
			res: entity.Wallet{},
			err: keyDbError,
		},
	}

	for _, tc := range tests {
		tc := tc
		t.Run(tc.name, func(t *testing.T) {
			tc.mock()

			res, err := u.Get(tc.req.(int))

			require.EqualValues(t, tc.res, res)
			if tc.err == nil {
				require.EqualValues(t, err, tc.err)
			} else {
				require.ErrorContains(t, err, dbError.Error())
			}
		})
	}

}

func TestWalletUseCaseCreate(t *testing.T) {
	u, r := wallet(t)

	req := entity.Wallet{
		Type: entity.IssuerType,
		Key: entity.Key{
			PublicKey: "key",
			Weight:    1,
		},
	}
	tests := []testWallet{
		{
			name: "create - success",
			req:  req,
			mock: func() {
				r.EXPECT().CreateWallet(req).Return(entity.Wallet{
					Id:   12,
					Type: entity.IssuerType,
					Key: entity.Key{
						PublicKey: "key",
						Weight:    1,
					},
				}, nil)
				r.EXPECT().CreateKey(entity.Key{
					PublicKey: "key",
					Weight:    1,
					WalletId:  12,
				}).Return(entity.Key{
					Id:        25,
					PublicKey: "key",
					Weight:    1,
					WalletId:  12,
				}, nil)
			},
			res: entity.Wallet{
				Id:   12,
				Type: entity.IssuerType,
				Key: entity.Key{
					Id:        25,
					PublicKey: "key",
					Weight:    1,
					WalletId:  12,
				},
			},
			err: nil,
		},
		{
			name: "create - wallet database error",
			req:  req,
			mock: func() {
				r.EXPECT().CreateWallet(req).Return(entity.Wallet{}, walletDbError)
			},
			res: entity.Wallet{},
			err: walletDbError,
		},
		{
			name: "create - key database error",
			req:  req,
			mock: func() {
				r.EXPECT().CreateWallet(req).Return(req, nil)
				r.EXPECT().CreateKey(req.Key).Return(entity.Key{}, keyDbError)
			},
			res: entity.Wallet{},
			err: keyDbError,
		},
	}

	for _, tc := range tests {
		tc := tc
		t.Run(tc.name, func(t *testing.T) {
			tc.mock()

			res, err := u.Create(tc.req.(entity.Wallet))

			require.EqualValues(t, tc.res, res)
			if tc.err == nil {
				require.EqualValues(t, err, tc.err)
			} else {
				require.ErrorContains(t, err, dbError.Error())
			}
		})
	}

}

func TestWalletUseCaseUpdate(t *testing.T) {
	u, r := wallet(t)

	req := entity.Wallet{
		Id:     2,
		Type:   entity.IssuerType,
		Funded: true,
	}
	tests := []testWallet{
		{
			name: "update - success",
			req:  req,
			mock: func() {
				r.EXPECT().UpdateWallet(req).Return(entity.Wallet{
					Id:     2,
					Type:   entity.IssuerType,
					Funded: true,
				}, nil)
			},
			res: entity.Wallet{
				Id:     2,
				Type:   entity.IssuerType,
				Funded: true,
			},
			err: nil,
		},
		{
			name: "update - database error",
			req:  req,
			mock: func() {
				r.EXPECT().UpdateWallet(req).Return(entity.Wallet{}, walletDbError)
			},
			res: entity.Wallet{},
			err: walletDbError,
		},
	}

	for _, tc := range tests {
		tc := tc
		t.Run(tc.name, func(t *testing.T) {
			tc.mock()

			res, err := u.Update(tc.req.(entity.Wallet))

			require.EqualValues(t, tc.res, res)
			if tc.err == nil {
				require.EqualValues(t, err, tc.err)
			} else {
				require.ErrorContains(t, err, dbError.Error())
			}
		})
	}

}
