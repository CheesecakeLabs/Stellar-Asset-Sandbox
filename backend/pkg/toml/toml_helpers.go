package toml

import "github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"

func (g *DefaultTomlGenerator) AppendTomlData(existing, updated entity.TomlData) (entity.TomlData, error) {
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

	return existing, nil
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
