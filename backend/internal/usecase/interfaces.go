package usecase

import "github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"

// mockgen -source=internal/usecase/interfaces.go -destination=internal/usecase/mocks/mocks.go -package=mocks

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
		GetWallet(int) (entity.Wallet, error)
		GetWallets(string) ([]entity.Wallet, error)
		CreateWallet(entity.Wallet) (entity.Wallet, error)
		CreateWalletWithKey(entity.Wallet) (entity.Wallet, error)
		UpdateWallet(entity.Wallet) (entity.Wallet, error)
		GetKeyByWallet(int) (entity.Key, error)
		CreateKey(entity.Key) (entity.Key, error)
	}

	// Asset -.
	AssetRepoInterface interface {
		GetAsset(int) (entity.Asset, error)
		GetAssets() ([]entity.Asset, error)
		GetAssetByCode(string) (entity.Asset, error)
		CreateAsset(entity.Asset) (entity.Asset, error)
		MintAsset(entity.Asset, int) (entity.Asset, error)
	}
)
