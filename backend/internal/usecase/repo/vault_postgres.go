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

func (r VaultRepo) GetVaults(isAll bool) ([]entity.Vault, error) {
	baseQuery := `
		SELECT 
			v.id AS vault_id, v.name AS vault_name, v.active AS vault_active, v.owner_id AS owner_id,
			vc.id AS vault_category_id, vc.name as vault_category_name, vc.theme as vault_category_theme,
			w.id AS wallet_id, w.type AS wallet_type, w.funded AS wallet_funded,
			wk.id AS wallet_key_id, wk.public_key AS wallet_key_public_key, wk.weight AS wallet_key_weight
		FROM vault v
		LEFT JOIN vaultcategory vc ON v.vault_category_id = vc.id
		JOIN wallet w ON v.wallet_id = w.id
		JOIN key wk ON w.id = wk.wallet_id
	`

	whereClause := `WHERE v.active = 1`

	if !isAll {
		whereClause = whereClause + ` AND v.owner_id is null`
	}

	query := baseQuery + whereClause

	rows, err := r.Db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("VaultRepo - GetVaultCategories - Query: %w", err)
	}
	defer rows.Close()

	vaults := []entity.Vault{}

	for rows.Next() {
		var vault entity.Vault
		var vaultCategoryId sql.NullInt64
		var vaultCategoryName sql.NullString
		var vaultCategoryTheme sql.NullString
		var wallet entity.Wallet

		err := rows.Scan(
			&vault.Id, &vault.Name, &vault.Active, &vault.OwnerId,
			&vaultCategoryId, &vaultCategoryName, &vaultCategoryTheme,
			&wallet.Id, &wallet.Type, &wallet.Funded,
			&wallet.Key.Id, &wallet.Key.PublicKey, &wallet.Key.Weight,
		)
		if err != nil {
			return nil, fmt.Errorf("VaultRepo - GetVaultCategories - row.Scan: %w", err)
		}

		vault.Wallet = wallet
		if vaultCategoryId.Valid {
			vault.VaultCategory = &entity.VaultCategory{
				Id:    int(vaultCategoryId.Int64),
				Name:  vaultCategoryName.String,
				Theme: &vaultCategoryTheme.String,
			}
		}

		vaults = append(vaults, vault)
	}

	return vaults, nil
}

func (r VaultRepo) GetVaultById(id int) (entity.Vault, error) {
	query := `
		SELECT 
			v.id AS vault_id, v.name AS vault_name, v.active as vault_active, v.owner_id AS owner_id,
			w.id AS wallet_id, w.type AS wallet_type, w.funded AS wallet_funded,
			wk.id AS wallet_key_id, wk.public_key AS wallet_key_public_key, wk.weight AS wallet_key_weight
		FROM vault v
		JOIN wallet w ON v.wallet_id = w.id
		JOIN key wk ON w.id = wk.wallet_id
		WHERE v.id = $1;
	`

	row := r.Db.QueryRow(query, id)

	var vault entity.Vault
	var wallet entity.Wallet

	err := row.Scan(
		&vault.Id, &vault.Name, &vault.Active, &vault.OwnerId,
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
	return vault, nil
}

func (r VaultRepo) CreateVault(data entity.Vault) (entity.Vault, error) {
	res := data
	var vaultCategoryId *int

	if data.VaultCategory.Id != 0 {
		vaultCategoryId = &data.VaultCategory.Id
	}

	stmt := `INSERT INTO Vault (name, vault_category_id, wallet_id, owner_id) VALUES ($1, $2, $3, $4) RETURNING id;`
	err := r.Db.QueryRow(stmt, data.Name, vaultCategoryId, data.Wallet.Id, data.OwnerId).Scan(&res.Id)
	if err != nil {
		return entity.Vault{}, fmt.Errorf("VaultRepo - Vault - db.QueryRow: %w", err)
	}

	return res, nil
}

func (r VaultRepo) UpdateVault(data entity.Vault) (entity.Vault, error) {
	stmt := `UPDATE Vault SET name = $1, vault_category_id = $2 WHERE id = $3 RETURNING id;`
	err := r.Db.QueryRow(stmt, data.Name, data.VaultCategory.Id, data.Id).Scan(&data.Id)
	if err != nil {
		if err == sql.ErrNoRows {
			return entity.Vault{}, fmt.Errorf("VaultRepo - UpdateVaultCategory - Vault not found")
		}
		return entity.Vault{}, fmt.Errorf("VaultRepo - UpdateVaultCategory - db.QueryRow: %w", err)
	}

	return data, nil
}

func (r VaultRepo) DeleteVault(data entity.Vault) (entity.Vault, error) {
	stmt := `UPDATE Vault SET active = $1 WHERE id = $2 RETURNING id;`
	err := r.Db.QueryRow(stmt, data.Active, data.Id).Scan(&data.Id)
	if err != nil {
		if err == sql.ErrNoRows {
			return entity.Vault{}, fmt.Errorf("VaultRepo - DeleteVault - Vault not found")
		}
		return entity.Vault{}, fmt.Errorf("VaultRepo - DeleteVault - db.QueryRow: %w", err)
	}

	return data, nil
}

// GetPaginatedVaults -.
func (r VaultRepo) GetPaginatedVaults(page, limit int) ([]entity.Vault, error) {
	// Calculate offset based on page number and limit
	offset := (page - 1) * limit

	query := `
        SELECT 
            v.id AS vault_id, v.name AS vault_name, v.active AS vault_active, v.owner_id AS owner_id,
            vc.id AS vault_category_id, vc.name as vault_category_name, vc.theme as vault_category_theme,
            w.id AS wallet_id, w.type AS wallet_type, w.funded AS wallet_funded,
            wk.id AS wallet_key_id, wk.public_key AS wallet_key_public_key, wk.weight AS wallet_key_weight
        FROM vault v
        JOIN vaultcategory vc ON v.vault_category_id = vc.id
        JOIN wallet w ON v.wallet_id = w.id
        JOIN key wk ON w.id = wk.wallet_id
        WHERE v.active = 1
        ORDER BY v.id DESC
        OFFSET $1 LIMIT $2;
    `

	rows, err := r.Db.Query(query, offset, limit)
	if err != nil {
		return nil, fmt.Errorf("VaultRepo - GetPaginatedVaults - Query: %w", err)
	}
	defer rows.Close()

	vaults := []entity.Vault{}

	for rows.Next() {
		var vault entity.Vault
		var vaultCategory entity.VaultCategory
		var wallet entity.Wallet

		err := rows.Scan(
			&vault.Id, &vault.Name, &vault.Active, &vault.OwnerId,
			&vaultCategory.Id, &vaultCategory.Name, &vaultCategory.Theme,
			&wallet.Id, &wallet.Type, &wallet.Funded,
			&wallet.Key.Id, &wallet.Key.PublicKey, &wallet.Key.Weight,
		)
		if err != nil {
			return nil, fmt.Errorf("VaultRepo - GetPaginatedVaults - row.Scan: %w", err)
		}

		vault.Wallet = wallet
		vault.VaultCategory = &vaultCategory

		vaults = append(vaults, vault)
	}

	return vaults, nil
}
