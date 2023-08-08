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
	if req.Version == "" {
		req.Version = cfg.StellarTomlVersion
	}
	if req.NetworkPassphrase == "" {
		req.NetworkPassphrase = cfg.TestNetworkPass
	}
	tomlBytes, err := toml.Marshal(req)
	if err != nil {
		return "", err
	}
	return string(tomlBytes), nil
}

func (g *DefaultTomlGenerator) RetrieveToml(asset string) (string, error) {
	return "", nil
}
