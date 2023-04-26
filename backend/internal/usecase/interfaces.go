package usecase

import "github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"

// mockgen -source=internal/usecase/interfaces.go -destination=internal/usecase/mocks/mocks_test.go -package=mocks

type (
	// UserRepo -.
	UserRepo interface {
		GetUser(name string) (entity.User, error)
		CreateUser(user entity.User) error
		UpdateToken(id string, token string) error
		ValidateToken(token string) error
	}

	// User -.
	User interface {
		Detail(name string) (entity.User, error)
		CreateUser(user entity.User) error
		Autentication(name string, password string) (User, error)
	}

	// Wallet -.
	WalletRepoInterface interface {
		GetWallets(string) ([]entity.Wallet, error)
		CreateWallet(entity.Wallet) (entity.Wallet, error)
		CreateKey(entity.Key) (entity.Key, error)
	}
)
