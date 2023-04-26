package usecase

import "github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"

// mockgen -source=internal/usecase/interfaces.go -destination=internal/usecase/mocks/mocks_test.go -package=mocks

type (
	WalletRepoInterface interface {
		GetWallet(int) (entity.Wallet, error)
		GetWallets(string) ([]entity.Wallet, error)
		CreateWallet(entity.Wallet) (entity.Wallet, error)
		GetKey(int) (entity.Key, error)
		CreateKey(entity.Key) (entity.Key, error)
	}
)
