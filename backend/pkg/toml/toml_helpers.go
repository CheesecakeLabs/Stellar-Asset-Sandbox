package toml

import (
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
)

type FieldConfig struct {
	Field     *string
	ConfigVal string
}

func updateFieldsIfEmpty(fields []FieldConfig) {
	for _, field := range fields {
		if *field.Field == "" {
			*field.Field = field.ConfigVal
		}
	}
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
