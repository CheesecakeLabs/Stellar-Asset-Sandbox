package repo

import (
	"database/sql"
	"fmt"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/CheesecakeLabs/token-factory-v2/backend/pkg/postgres"
)

type VaultCategoryRepo struct {
	*postgres.Postgres
}

func NewVaultCategoryRepo(pg *postgres.Postgres) VaultCategoryRepo {
	return VaultCategoryRepo{pg}
}

func (r VaultCategoryRepo) GetVaultCategories() ([]entity.VaultCategory, error) {
	query := `SELECT id, name FROM VaultCategory`

	rows, err := r.Db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("VaultCategoryRepo - GetVaultCategories - Query: %w", err)
	}
	defer rows.Close()

	vaultCategories := []entity.VaultCategory{}

	for rows.Next() {
		var vaultCategory entity.VaultCategory

		err := rows.Scan(&vaultCategory.Id, &vaultCategory.Name)
		if err != nil {
			return nil, fmt.Errorf("VaultCategoryRepo - GetVaultCategories - row.Scan: %w", err)
		}

		vaultCategories = append(vaultCategories, vaultCategory)
	}

	return vaultCategories, nil
}

func (r VaultCategoryRepo) GetVaultCategoryById(id int) (entity.VaultCategory, error) {
	query := `SELECT id, name FROM VaultCategory WHERE id = $1`

	row := r.Db.QueryRow(query, id)

	var vaultCategory entity.VaultCategory

	err := row.Scan(&vaultCategory.Id, &vaultCategory.Name)
	if err != nil {
		if err == sql.ErrNoRows {
			return entity.VaultCategory{}, fmt.Errorf("VaultCategoryRepo - GetVaultCategoryById - Vault category not found")
		}
		return entity.VaultCategory{}, fmt.Errorf("VaultCategoryRepo - GetVaultCategoryById - row.Scan: %w", err)
	}

	return vaultCategory, nil
}

func (r VaultCategoryRepo) CreateVaultCategory(data entity.VaultCategory) (entity.VaultCategory, error) {
	res := data
	stmt := `INSERT INTO VaultCategory (name) VALUES ($1) RETURNING id;`
	err := r.Db.QueryRow(stmt, data.Name).Scan(&res.Id)
	if err != nil {
		return entity.VaultCategory{}, fmt.Errorf("VaultCategoryRepo - VaultCategory - db.QueryRow: %w", err)
	}

	return res, nil
}
