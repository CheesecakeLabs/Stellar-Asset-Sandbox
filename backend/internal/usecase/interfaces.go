package usecase

import (
	"time"

	"github.com/CheesecakeLabs/token-factory-v2/backend/config"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
)

// mockgen -source=internal/usecase/interfaces.go -destination=internal/usecase/mocks/mocks.go -package=mocks

type (
	// UserRepo -.
	UserRepo interface {
		GetUser(email string) (entity.User, error)
		CreateUser(user entity.User) error
		UpdateToken(id string, token string) error
		ValidateToken(token string) error
		GetUserByToken(token string) (entity.User, error)
		GetAllUsers() ([]entity.UserResponse, error)
		EditUsersRole(id_user string, id_role string) error
		GetProfile(token string) (entity.UserResponse, error)
		GetSuperAdminUsers() ([]entity.UserResponse, error)
		UpdateName(id string, name string) error 
		IsUserSuperAdmin(id string) (bool, error)
	}

	// User -.
	User interface {
		Detail(email string) (entity.User, error)
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
		GetAssets(entity.AssetFilter) ([]entity.Asset, error)
		GetAssetByCode(string) (entity.Asset, error)
		CreateAsset(entity.Asset) (entity.Asset, error)
		GetAssetById(string) (entity.Asset, error)
		StoreAssetImage(string, string) error
		GetAssetImage(string) ([]byte, error)
		GetPaginatedAssets(int, int, entity.AssetFilter) ([]entity.Asset, int, error)
		UpdateContractId(string, string) error
		UpdateNameAndCode(string, string, string) error
	}

	// Role -.
	RoleRepoInterface interface {
		GetRoles() ([]entity.Role, error)
		CreateRole(entity.RoleRequest) (entity.RoleRequest, error)
		UpdateRole(entity.Role) (entity.Role, error)
		DeleteRole(entity.RoleDelete) (entity.RoleDelete, error)
		GetRoleById(id int) (entity.Role, error)
		GetSuperAdminRole() (entity.Role, error)
	}

	// Role Permission-.
	RolePermissionRepoInterface interface {
		Validate(action string, roleId int) (bool, error)
		GetUserPermissions(token string) ([]entity.UserPermissionResponse, error)
		GetRolesPermissions() ([]entity.RolePermissionResponse, error)
		GetPermissions() ([]entity.Permission, error)
		DeleteRolePermission(entity.RolePermissionRequest) (entity.RolePermissionRequest, error)
		CreateRolePermission(entity.RolePermissionRequest) (entity.RolePermissionRequest, error)
	}

	TomlInterface interface {
		GenerateToml(entity.TomlData, config.Horizon) (string, error)
		RetrieveToml(string) (entity.TomlData, error)
		UpdateTomlData(entity.TomlData, entity.TomlData) (entity.TomlData, error)
	}

	TomlRepoInterface interface {
		CreateToml(string) (string, error)
		GetToml() (string, error)
	}

	VaultCategoryRepoInterface interface {
		GetVaultCategories() ([]entity.VaultCategory, error)
		GetVaultCategoryById(id int) (entity.VaultCategory, error)
		CreateVaultCategory(entity.VaultCategory) (entity.VaultCategory, error)
	}

	VaultRepoInterface interface {
		GetVaults(isAll bool) ([]entity.Vault, error)
		CreateVault(entity.Vault) (entity.Vault, error)
		UpdateVault(entity.Vault) (entity.Vault, error)
		GetVaultById(id int) (entity.Vault, error)
		DeleteVault(entity.Vault) (entity.Vault, error)
		GetPaginatedVaults(int, int) ([]entity.Vault, int, error)
	}

	ContractRepoInterface interface {
		GetContracts() ([]entity.Contract, error)
		CreateContract(entity.Contract) (entity.Contract, error)
		GetContractById(id string) (entity.Contract, error)
		GetPaginatedContracts(int, int) ([]entity.Contract, int, error)
		GetHistory(userId int, contractId int) ([]entity.ContractHistory, error)
		AddContractHistory(contractHistory entity.ContractHistory) (entity.ContractHistory, error)
		UpdateContractHistory(contractHistory entity.ContractHistory) (entity.ContractHistory, error)
	}

	LogTransactionRepoInterface interface {
		StoreLogTransaction(entity.LogTransaction) error
		GetLogTransactions(timeRange string) ([]entity.LogTransaction, error)
		GetLogTransactionsByAssetID(assetID int, timeRange string) ([]entity.LogTransaction, error)
		GetLogTransactionsByUserID(userID int, timeRange string) ([]entity.LogTransaction, error)
		GetLogTransactionsByTransactionTypeID(transactionTypeID int, timeRange string) ([]entity.LogTransaction, error)
		SumLogTransactionsByAssetID(assetID int, timeRange string, timeFrame time.Duration, transactionType int) (entity.SumLogTransaction, error)
		SumLogTransactions(timeRange string, timeFrame time.Duration) ([]entity.SumLogTransaction, error)
		GetLastLogTransactions(transactionTypeID int) ([]entity.LogTransaction, error)
		SumLogTransactionSupply(timeRange string, timeFrame time.Duration) ([]entity.SumLogTransactionSupply, error)
		LogTransactionSupplyByAssetID(assetID int, timeRange string, periodInitial string, interval string) (entity.LogTransactionSupply, error)
	}

	// Asset Service
	AssetServiceInterface interface {
		UploadFile(string, []byte) (string, error)
	}
)
