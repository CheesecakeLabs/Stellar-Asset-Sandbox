package toml

import (
	"github.com/CheesecakeLabs/token-factory-v2/backend/config"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/pelletier/go-toml/v2"
)

type DefaultTomlGenerator struct{}

func NewTomlGenerator() *DefaultTomlGenerator {
	return &DefaultTomlGenerator{}
}

func (g *DefaultTomlGenerator) GenerateToml(req entity.TomlData, cfg config.Horizon) (string, error) {
	fieldConfigs := []FieldConfig{
		{&req.Version, cfg.StellarTomlVersion},
		{&req.NetworkPassphrase, cfg.TestNetworkPass},
		{&req.FederationServer, cfg.FederationServer},
		{&req.TransferServer, cfg.TransferServer},
		{&req.HorizonURL, cfg.HorizonURL},
	}

	docFieldConfigs := []FieldConfig{
		{&req.Documentation.OrgName, cfg.Documentation.OrgName},
		{&req.Documentation.OrgDBA, cfg.Documentation.OrgDBA},
		{&req.Documentation.OrgURL, cfg.Documentation.OrgURL},
		{&req.Documentation.OrgLogo, cfg.Documentation.OrgLogo},
		{&req.Documentation.OrgDescription, cfg.Documentation.OrgDescription},
		{&req.Documentation.OrgPhysicalAddress, cfg.Documentation.OrgPhysicalAddress},
		{&req.Documentation.OrgPhysicalAddressAttestation, cfg.Documentation.OrgPhysicalAddressAttestation},
		{&req.Documentation.OrgPhoneNumber, cfg.Documentation.OrgPhoneNumber},
		{&req.Documentation.OrgPhoneNumberAttestation, cfg.Documentation.OrgPhoneNumberAttestation},
		{&req.Documentation.OrgKeybase, cfg.Documentation.OrgKeybase},
		{&req.Documentation.OrgTwitter, cfg.Documentation.OrgTwitter},
		{&req.Documentation.OrgGithub, cfg.Documentation.OrgGithub},
		{&req.Documentation.OrgOfficialEmail, cfg.Documentation.OrgOfficialEmail},
	}

	principalFieldConfigs := []FieldConfig{
		{&req.Principals[0].Name, cfg.Principals.Name},
		{&req.Principals[0].Email, cfg.Principals.Email},
		{&req.Principals[0].Keybase, cfg.Principals.Keybase},
		{&req.Principals[0].Twitter, cfg.Principals.Twitter},
		{&req.Principals[0].Github, cfg.Principals.Github},
		{&req.Principals[0].IDPhotoHash, cfg.Principals.IDPhotoHash},
		{&req.Principals[0].VerificationPhotoHash, cfg.Principals.VerificationPhotoHash},
	}

	updateFieldsIfEmpty(fieldConfigs)
	updateFieldsIfEmpty(docFieldConfigs)
	updateFieldsIfEmpty(principalFieldConfigs)

	tomlBytes, err := toml.Marshal(req)
	if err != nil {
		return "", err
	}
	return string(tomlBytes), nil
}

func (g *DefaultTomlGenerator) UpdateTomlData(existing, updated entity.TomlData) (entity.TomlData, error) {
	updateFieldsIfEmpty([]FieldConfig{
		{&existing.Version, updated.Version},
		{&existing.NetworkPassphrase, updated.NetworkPassphrase},
		{&existing.FederationServer, updated.FederationServer},
		{&existing.TransferServer, updated.TransferServer},
		{&existing.SigningKey, updated.SigningKey},
		{&existing.HorizonURL, updated.HorizonURL},
	})

	existing.Documentation = updated.Documentation
	existing.Accounts = appendIfNotExists(existing.Accounts, updated.Accounts, func(item1, item2 string) bool {
		return item1 == item2
	})
	existing.Principals = appendIfNotExistsPrincipal(existing.Principals, updated.Principals)
	existing.Currencies = appendIfNotExistsCurrency(existing.Currencies, updated.Currencies)
	existing.Validators = appendIfNotExistsValidator(existing.Validators, updated.Validators)

	return existing, nil
}

func (g *DefaultTomlGenerator) RetrieveToml(data string) (entity.TomlData, error) {
	var cfg entity.TomlData
	err := toml.Unmarshal([]byte(data), &cfg)
	if err != nil {
		return entity.TomlData{}, err
	}
	return cfg, nil
}
