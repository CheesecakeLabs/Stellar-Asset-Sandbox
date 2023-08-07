package repo

import (
	"database/sql"
	"fmt"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/CheesecakeLabs/token-factory-v2/backend/pkg/postgres"
)

type VaultRepo struct {
	*postgres.Postgres
}

func NewVaultRepo(pg *postgres.Postgres) VaultRepo {
	return VaultRepo{pg}
}

func (r VaultRepo) GetVaults() ([]entity.Vault, error) {
	query := `
		SELECT 
			v.id AS vault_id, v.name AS vault_name,
			vc.id AS vault_category_id, vc.name as vault_category_name,
			w.id AS wallet_id, w.type AS wallet_type, w.funded AS wallet_funded,
			wk.id AS wallet_key_id, wk.public_key AS wallet_key_public_key, wk.weight AS wallet_key_weight
		FROM vault v
		JOIN vaultcategory vc ON v.vault_category_id = vc.id
		JOIN wallet w ON v.wallet_id = w.id
		JOIN key wk ON w.id = wk.wallet_id;
	`

	rows, err := r.Db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("VaultRepo - GetVaultCategories - Query: %w", err)
	}
	defer rows.Close()

	vaults := []entity.Vault{}

	for rows.Next() {
		var vault entity.Vault
		var vaultCategory entity.VaultCategory
		var wallet entity.Wallet

		err := rows.Scan(
			&vault.Id, &vault.Name,
			&vaultCategory.Id, &vaultCategory.Name,
			&wallet.Id, &wallet.Type, &wallet.Funded,
			&wallet.Key.Id, &wallet.Key.PublicKey, &wallet.Key.Weight,
		)
		if err != nil {
			return nil, fmt.Errorf("VaultRepo - GetVaultCategories - row.Scan: %w", err)
		}

		vault.Wallet = wallet
		vault.VaultCategory = vaultCategory

		vaults = append(vaults, vault)
	}

	return vaults, nil
}

func (r VaultRepo) GetVaultById(id string) (entity.Vault, error) {
	query := `
		SELECT 
			v.id AS vault_id, v.name AS vault_name,
			vc.id AS vault_category_id, vc.name as vault_category_name,
			w.id AS wallet_id, w.type AS wallet_type, w.funded AS wallet_funded,
			wk.id AS wallet_key_id, wk.public_key AS wallet_key_public_key, wk.weight AS wallet_key_weight
		FROM vault v
		JOIN vaultcategory vc ON v.vault_category_id = vc.id
		JOIN wallet w ON v.wallet_id = w.id
		JOIN key wk ON w.id = wk.wallet_id
		WHERE v.id = $1;
	`

	row := r.Db.QueryRow(query, id)

	var vault entity.Vault
	var vaultCategory entity.VaultCategory
	var wallet entity.Wallet

	err := row.Scan(
		&vault.Id, &vault.Name,
		&vaultCategory.Id, &vaultCategory.Name,
		&wallet.Id, &wallet.Type, &wallet.Funded,
		&wallet.Key.Id, &wallet.Key.PublicKey, &wallet.Key.Weight,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return entity.Vault{}, fmt.Errorf("VaultRepo - GetVaultById - Vault not found")
		}
		return entity.Vault{}, fmt.Errorf("VaultRepo - GetVaultById - row.Scan: %w", err)
	}

	vault.Wallet = wallet
	vault.VaultCategory = vaultCategory

	return vault, nil
}

func (r VaultRepo) CreateVault(data entity.Vault) (entity.Vault, error) {
	res := data
	stmt := `INSERT INTO Vault (name, vault_category_id, wallet_id) VALUES ($1, $2, $3) RETURNING id;`
	err := r.Db.QueryRow(stmt, data.Name, data.VaultCategory.Id, data.Wallet.Id).Scan(&res.Id)
	if err != nil {
		return entity.Vault{}, fmt.Errorf("VaultRepo - Vault - db.QueryRow: %w", err)
	}

	return res, nil
}
