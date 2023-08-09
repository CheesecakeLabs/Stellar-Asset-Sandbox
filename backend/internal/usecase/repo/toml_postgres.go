package repo

import (
	"fmt"

	"github.com/CheesecakeLabs/token-factory-v2/backend/pkg/postgres"
)

type TomlRepoInterface struct {
	*postgres.Postgres
}

func NewTomlRepo(pg *postgres.Postgres) TomlRepoInterface {
	return TomlRepoInterface{
		Postgres: pg,
	}
}

func (r TomlRepoInterface) CreateToml(content string) (string, error) {
	res := content
	stmt := `INSERT INTO toml (content) VALUES ($1) RETURNING toml;`
	err := r.Db.QueryRow(stmt, content).Scan(&res)
	if err != nil {
		return "", fmt.Errorf("AssetRepo - CreateToml - db.QueryRow: %w", err)
	}
	return res, nil
}

func (r TomlRepoInterface) GetToml() (string, error) {
	var res string
	stmt := `SELECT content FROM toml ORDER BY id DESC LIMIT 1;`
	err := r.Db.QueryRow(stmt).Scan(&res)
	if err != nil {
		return "", fmt.Errorf("AssetRepo - GetToml - db.QueryRow: %w", err)
	}
	return res, nil
}
