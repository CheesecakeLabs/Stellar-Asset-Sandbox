package usecase_test

import (
	"errors"
	"testing"

	"github.com/CheesecakeLabs/token-factory-v2/backend/config"
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

func asset(t *testing.T) (*usecase.AssetUseCase, *mocks.MockAssetRepoInterface, *mocks.MockWalletRepoInterface, *mocks.MockTomlInterface) {
	t.Helper()

	mockCtl := gomock.NewController(t)
	defer mockCtl.Finish()

	rw := mocks.NewMockWalletRepoInterface(mockCtl)
	ra := mocks.NewMockAssetRepoInterface(mockCtl)
	tg := mocks.NewMockTomlInterface(mockCtl)
	tr := mocks.NewMockTomlRepoInterface(mockCtl)
	u := usecase.NewAssetUseCase(ra, rw, tg, tr, config.Horizon{})

	return u, ra, rw, tg
}

func TestAssetUseCaseCreate(t *testing.T) {
	u, ra, rw, tg := asset(t)

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

	tests = []testAsset{
		{
			name: "get - success",
			req:  req,
			mock: func() {
				ra.EXPECT().GetAssetByCode(req.Code).Return(updatedReq, nil)
			},
			res: updatedReq,
			err: nil,
		},
		{
			name: "get - database error",
			req:  req,
			mock: func() {
				ra.EXPECT().GetAssetByCode(req.Code).Return(entity.Asset{}, assetDbError)
			},
			res: entity.Asset{},
			err: assetDbError,
		},
	}

	for _, tc := range tests {
		tc := tc
		t.Run(tc.name, func(t *testing.T) {
			tc.mock()

			res, err := u.Get(tc.req.(entity.Asset).Code)

			require.EqualValues(t, tc.res, res)
			if tc.err == nil {
				require.EqualValues(t, err, tc.err)
			} else {
				require.ErrorContains(t, err, tc.err.Error())
			}
		})
	}

	assetID := 123
	mockAsset := entity.Asset{
		Id:   assetID,
		Code: "ABC",
	}

	mockAssets := []entity.Asset{
		mockAsset,
	}

	mockToml := "mock toml data"
	mockReq := entity.TomlData{
		Version: "2.0.0",
	}

	tests = []testAsset{
		// Test for GetById
		{
			name: "get by id - success",
			req:  assetID,
			mock: func() {
				ra.EXPECT().GetAssetById(assetID).Return(mockAsset, nil)
			},
			res: mockAsset,
			err: nil,
		},
		// Add other test cases for GetById...
		{
			name: "get by id - database error",
			req:  assetID,
			mock: func() {
				ra.EXPECT().GetAssetById(assetID).Return(entity.Asset{}, assetDbError)
			},
			res: entity.Asset{},
			err: assetDbError,
		},
		// Test for GetAll
		{
			name: "get all - success",
			mock: func() {
				ra.EXPECT().GetAssets().Return(mockAssets, nil)
			},
			res: mockAssets,
			err: nil,
		},
		{
			name: "get all - database error",
			mock: func() {
				ra.EXPECT().GetAssets().Return([]entity.Asset{}, assetDbError)
			},
			res: []entity.Asset{},
			err: assetDbError,
		},
		{
			name: "create toml - success",
			req:  mockReq,
			mock: func() {
				mockCfg := config.Horizon{} // Mock configuration
				mockTRepo := tg
				mockTRepo.EXPECT().GenerateToml(mockReq, mockCfg).Return(mockToml, nil)
			},
			res: mockToml,
			err: nil,
		},
		{
			name: "create toml - error",
			req:  mockReq,
			mock: func() {
				mockCfg := config.Horizon{} // Mock configuration
				mockTRepo := tg
				mockTRepo.EXPECT().GenerateToml(mockReq, mockCfg).Return("", errors.New("error"))
			},
			res: "",
			err: errors.New("error"),
		},
	}

	for _, tc := range tests {
		tc := tc
		t.Run(tc.name, func(t *testing.T) {
			tc.mock()

			// Test GetById
			if assetID, ok := tc.req.(string); ok {
				res, err := u.GetById(assetID)
				require.EqualValues(t, tc.res, res)
				if tc.err == nil {
					require.EqualValues(t, err, tc.err)
				} else {
					require.ErrorContains(t, err, tc.err.Error())
				}
			}

			// Test GetAll
			if _, ok := tc.req.(bool); ok {
				res, err := u.GetAll()
				require.EqualValues(t, tc.res, res)
				if tc.err == nil {
					require.EqualValues(t, err, tc.err)
				} else {
					require.ErrorContains(t, err, tc.err.Error())
				}
			}

			// Test CreateToml
			if req, ok := tc.req.(entity.TomlData); ok {
				res, err := u.CreateToml(req)
				require.EqualValues(t, tc.res, res)
				if tc.err == nil {
					require.EqualValues(t, err, tc.err)
				} else {
					require.ErrorContains(t, err, tc.err.Error())
				}
			}
		})
	}
}
