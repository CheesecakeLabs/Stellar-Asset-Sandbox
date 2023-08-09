package usecase

import (
	"fmt"

	"github.com/CheesecakeLabs/token-factory-v2/backend/config"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
)

type AssetUseCase struct {
	aRepo AssetRepoInterface
	wRepo WalletRepoInterface
	tInt  TomlInterface
	tRepo TomlRepoInterface
	cfg   config.Horizon
}

func NewAssetUseCase(aRepo AssetRepoInterface, wRepo WalletRepoInterface, tInt TomlInterface, tRepo TomlRepoInterface, cfg config.Horizon) *AssetUseCase {
	return &AssetUseCase{
		aRepo: aRepo,
		wRepo: wRepo,
		tInt:  tInt,
		tRepo: tRepo,
		cfg:   cfg,
	}
}

func (uc *AssetUseCase) Create(data entity.Asset) (entity.Asset, error) {
	issuer, err := uc.wRepo.CreateWalletWithKey(data.Issuer)
	if err != nil {
		return entity.Asset{}, fmt.Errorf("AssetUseCase - Create - uc.repo.CreateWalletWithKey(issuer): %w", err)
	}
	data.Issuer.Id = issuer.Id

	dist, err := uc.wRepo.CreateWalletWithKey(data.Distributor)
	if err != nil {
		return entity.Asset{}, fmt.Errorf("AssetUseCase - Create - uc.repo.CreateWalletWithKey(dist): %w", err)
	}
	data.Distributor.Id = dist.Id

	asset, err := uc.aRepo.CreateAsset(data)
	if err != nil {
		return entity.Asset{}, fmt.Errorf("AssetUseCase - Create - uc.repo.CreateWallet: %w", err)
	}

	return asset, nil
}

func (uc *AssetUseCase) Get(code string) (entity.Asset, error) {
	asset, err := uc.aRepo.GetAssetByCode(code)
	if err != nil {
		return entity.Asset{}, fmt.Errorf("AssetUseCase - Get - uc.repo.GetAssetByCode: %w", err)
	}

	return asset, nil
}

func (uc *AssetUseCase) GetById(id string) (entity.Asset, error) {
	asset, err := uc.aRepo.GetAssetById(id)
	if err != nil {
		return entity.Asset{}, fmt.Errorf("AssetUseCase - Get - uc.repo.GetAssetByCode: %w", err)
	}

	return asset, nil
}

func (uc *AssetUseCase) GetAll() ([]entity.Asset, error) {
	assets, err := uc.aRepo.GetAssets()
	if err != nil {
		return nil, fmt.Errorf("AssetUseCase - GetAll - uc.repo.GetAssets: %w", err)
	}

	return assets, nil
}

func (uc *AssetUseCase) CreateToml(req entity.TomlData) (string, error) {
	toml, err := uc.tInt.GenerateToml(req, uc.cfg)
	if err != nil {
		return "", fmt.Errorf("AssetUseCase - CreateToml - uc.tInt.GenerateToml: %w", err)
	}

	_, err = uc.tRepo.CreateToml(toml)
	if err != nil {
		return "", fmt.Errorf("AssetUseCase - CreateToml - uc.repo.CreateToml: %w", err)
	}

	return toml, err
}

func (uc *AssetUseCase) RetrieveToml() (string, error) {
	toml, err := uc.tRepo.GetToml()
	if err != nil {
		return "", fmt.Errorf("AssetUseCase - RetrieveToml - uc.repo.GetToml: %w", err)
	}

	return toml, err
}

func (uc *AssetUseCase) UpdateToml(updatedToml entity.TomlData) (string, error) {
	// Get old toml data in the database
	oldTomlDb, err := uc.tRepo.GetToml()
	if err != nil {
		return "", fmt.Errorf("AssetUseCase - RetrieveToml - uc.repo.GetToml: %w", err)
	}

	oldTomParsed, err := uc.tInt.RetrieveToml(oldTomlDb) // Parse old toml data
	if err != nil {
		return "", fmt.Errorf("AssetUseCase - UpdateToml - uc.tInt.GenerateToml: %w", err)
	}

	// Update old toml data with new data
	newTomlParsed := updateTomlData(oldTomParsed, updatedToml)

	// Parse the new toml data in a TOML string
	tomlCreated, err := uc.tInt.GenerateToml(newTomlParsed, uc.cfg)
	if err != nil {
		return "", fmt.Errorf("AssetUseCase - CreateToml - uc.tInt.GenerateToml: %w", err)
	}

	// Save the new toml data in the database
	_, err = uc.tRepo.CreateToml(tomlCreated)
	if err != nil {
		return "", fmt.Errorf("AssetUseCase - UpdateToml - uc.repo.CreateToml: %w", err)
	}

	return tomlCreated, err
}

func updateTomlData(existing, updated entity.TomlData) entity.TomlData {
	if updated.Version != "" {
		existing.Version = updated.Version
	}
	if updated.NetworkPassphrase != "" {
		existing.NetworkPassphrase = updated.NetworkPassphrase
	}
	if updated.FederationServer != "" {
		existing.FederationServer = updated.FederationServer
	}
	if updated.TransferServer != "" {
		existing.TransferServer = updated.TransferServer
	}
	if updated.SigningKey != "" {
		existing.SigningKey = updated.SigningKey
	}
	if updated.HorizonURL != "" {
		existing.HorizonURL = updated.HorizonURL
	}

	existing.Accounts = appendIfNotExists(existing.Accounts, updated.Accounts, func(item1, item2 string) bool {
		return item1 == item2
	})
	existing.Principals = appendIfNotExistsPrincipal(existing.Principals, updated.Principals)
	existing.Currencies = appendIfNotExistsCurrency(existing.Currencies, updated.Currencies)
	existing.Validators = appendIfNotExistsValidator(existing.Validators, updated.Validators)

	return existing
}

func appendIfNotExists[T any](existing []T, newItems []T, equals func(T, T) bool) []T {
	for _, newItem := range newItems {
		found := false
		for _, item := range existing {
			if equals(item, newItem) {
				found = true
				break
			}
		}
		if !found {
			existing = append(existing, newItem)
		}
	}
	return existing
}

func appendIfNotExistsPrincipal(existing []entity.Principal, newItems []entity.Principal) []entity.Principal {
	return appendIfNotExists(existing, newItems, func(item1, item2 entity.Principal) bool {
		return item1.Name == item2.Name
	})
}

func appendIfNotExistsCurrency(existing []entity.Currency, newItems []entity.Currency) []entity.Currency {
	return appendIfNotExists(existing, newItems, func(item1, item2 entity.Currency) bool {
		return item1.Code == item2.Code
	})
}

func appendIfNotExistsValidator(existing []entity.Validator, newItems []entity.Validator) []entity.Validator {
	return appendIfNotExists(existing, newItems, func(item1, item2 entity.Validator) bool {
		return item1.Alias == item2.Alias
	})
}
