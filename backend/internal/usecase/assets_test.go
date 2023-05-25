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

var (
	issuerDbError = errors.New("issuerDbError")
	distDbError   = errors.New("distDbError")
	assetDbError  = errors.New("assetDbError")
)

type testAsset struct {
	name string
	mock func()
	req  interface{}
	res  interface{}
	err  error
}

func asset(t *testing.T) (*usecase.AssetUseCase, *mocks.MockAssetRepoInterface, *mocks.MockWalletRepoInterface) {
	t.Helper()

	mockCtl := gomock.NewController(t)
	defer mockCtl.Finish()

	rw := mocks.NewMockWalletRepoInterface(mockCtl)
	ra := mocks.NewMockAssetRepoInterface(mockCtl)
	u := usecase.NewAssetUseCase(ra, rw)

	return u, ra, rw
}

func TestAssetUseCaseCreate(t *testing.T) {
	u, ra, rw := asset(t)

	req := entity.Asset{
		Code: "ABC",
		Issuer: entity.Wallet{
			Type:   entity.IssuerType,
			Funded: true,
			Key: entity.Key{
				PublicKey: "issuerPK",
				Weight:    1,
			},
		},
		Distributor: entity.Wallet{
			Type:   entity.DistributorType,
			Funded: true,
			Key: entity.Key{
				PublicKey: "distPK",
				Weight:    1,
			},
		},
	}
	updatedReq := req
	updatedReq.Issuer.Id = 10
	updatedReq.Distributor.Id = 20

	tests := []testAsset{
		{
			name: "create - success",
			req:  req,
			mock: func() {
				rw.EXPECT().CreateWalletWithKey(req.Issuer).Return(entity.Wallet{
					Id:     10,
					Type:   entity.IssuerType,
					Funded: true,
					Key: entity.Key{
						PublicKey: "issuerPK",
						Weight:    1,
					},
				}, nil)
				rw.EXPECT().CreateWalletWithKey(req.Distributor).Return(entity.Wallet{
					Id:     20,
					Type:   entity.DistributorType,
					Funded: true,
					Key: entity.Key{
						PublicKey: "distPK",
						Weight:    1,
					},
				}, nil)
				ra.EXPECT().CreateAsset(updatedReq).Return(updatedReq, nil)
			},
			res: updatedReq,
			err: nil,
		},
		{
			name: "create - issuer creation database error",
			req:  req,
			mock: func() {
				rw.EXPECT().CreateWalletWithKey(req.Issuer).Return(entity.Wallet{}, issuerDbError)
			},
			res: entity.Asset{},
			err: issuerDbError,
		},
		{
			name: "create - distributor creation database error",
			req:  req,
			mock: func() {
				rw.EXPECT().CreateWalletWithKey(req.Issuer).Return(entity.Wallet{
					Id:     10,
					Type:   entity.IssuerType,
					Funded: true,
					Key: entity.Key{
						PublicKey: "issuerPK",
						Weight:    1,
					},
				}, nil)
				rw.EXPECT().CreateWalletWithKey(req.Distributor).Return(entity.Wallet{}, distDbError)
			},
			res: entity.Asset{},
			err: distDbError,
		},
		{
			name: "create - asset creation database error",
			req:  req,
			mock: func() {
				rw.EXPECT().CreateWalletWithKey(req.Issuer).Return(entity.Wallet{
					Id:     10,
					Type:   entity.IssuerType,
					Funded: true,
					Key: entity.Key{
						PublicKey: "issuerPK",
						Weight:    1,
					},
				}, nil)
				rw.EXPECT().CreateWalletWithKey(req.Distributor).Return(entity.Wallet{
					Id:     20,
					Type:   entity.DistributorType,
					Funded: true,
					Key: entity.Key{
						PublicKey: "distPK",
						Weight:    1,
					},
				}, nil)
				ra.EXPECT().CreateAsset(updatedReq).Return(entity.Asset{}, assetDbError)
			},
			res: entity.Asset{},
			err: assetDbError,
		},
	}

	for _, tc := range tests {
		tc := tc
		t.Run(tc.name, func(t *testing.T) {
			tc.mock()

			res, err := u.Create(tc.req.(entity.Asset))

			require.EqualValues(t, tc.res, res)
			if tc.err == nil {
				require.EqualValues(t, err, tc.err)
			} else {
				require.ErrorContains(t, err, tc.err.Error())
			}
		})
	}
}
