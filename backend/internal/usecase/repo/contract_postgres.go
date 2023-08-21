package repo

import (
	"database/sql"
	"fmt"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/CheesecakeLabs/token-factory-v2/backend/pkg/postgres"
)

type ContractRepo struct {
	*postgres.Postgres
}

func NewContractRepo(pg *postgres.Postgres) ContractRepo {
	return ContractRepo{pg}
}

func (r ContractRepo) GetContracts() ([]entity.Contract, error) {
	query := `
		SELECT 
			c.id AS contract_id, c.name AS contract_name, c.address AS contract_address, c.yield_rate AS contract_yield_rate, 
			c.term AS contract_term, c.min_deposit AS contract_min_deposit, c.penalty_rate AS contract_penalty_rate,
			v.id AS vault_id, v.name AS vault_name,
			vc.id AS vault_category_id, vc.name as vault_category_name,
			w.id AS wallet_id, w.type AS wallet_type, w.funded AS wallet_funded,
			wk.id AS wallet_key_id, wk.public_key AS wallet_key_public_key, wk.weight AS wallet_key_weight
		FROM contracts c
		JOIN vault v ON c.vault_id = v.id
		JOIN vaultcategory vc ON v.vault_category_id = vc.id
		JOIN wallet w ON v.wallet_id = w.id
		JOIN key wk ON w.id = wk.wallet_id;
	`

	rows, err := r.Db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("ContractRepo - GetContractCategories - Query: %w", err)
	}
	defer rows.Close()

	contracts := []entity.Contract{}

	for rows.Next() {
		var contract entity.Contract
		var vaultCategory entity.VaultCategory
		var vault entity.Vault
		var asset entity.Asset
		var wallet entity.Wallet

		err := rows.Scan(
			&contract.Id, &contract.Name, &contract.Address, &contract.YieldRate, &contract.Term, &contract.MinDeposit, &contract.PenaltyRate,
			&vault.Id, &vault.Name,
			&vaultCategory.Id, &vaultCategory.Name,
			&wallet.Id, &wallet.Type, &wallet.Funded,
			&wallet.Key.Id, &wallet.Key.PublicKey, &wallet.Key.Weight,
		)
		if err != nil {
			return nil, fmt.Errorf("ContractRepo - GetContractCategories - row.Scan: %w", err)
		}

		vault.Wallet = wallet
		vault.VaultCategory = vaultCategory
		contract.Asset = asset
		contract.Vault = vault

		contracts = append(contracts, contract)
	}

	return contracts, nil
}

func (r ContractRepo) GetContractById(id string) (entity.Contract, error) {
	query := `
		SELECT 
			c.id AS contract_id, c.name AS contract_name, c.address AS contract_address, c.yield_rate AS contract_yield_rate, 
			c.term AS contract_term, c.min_deposit AS contract_min_deposit, c.penalty_rate AS contract_penalty_rate,
			v.id AS vault_id, v.name AS vault_name,
			vc.id AS vault_category_id, vc.name as vault_category_name,
			w.id AS wallet_id, w.type AS wallet_type, w.funded AS wallet_funded,
			wk.id AS wallet_key_id, wk.public_key AS wallet_key_public_key, wk.weight AS wallet_key_weight
		FROM contracts c
		JOIN vault v ON c.vault_id = v.id
		JOIN vaultcategory vc ON v.vault_category_id = vc.id
		JOIN wallet w ON v.wallet_id = w.id
		JOIN key wk ON w.id = wk.wallet_id
		WHERE c.id = $1;
	`

	row := r.Db.QueryRow(query, id)

	var contract entity.Contract
	var vaultCategory entity.VaultCategory
	var vault entity.Vault
	var asset entity.Asset
	var wallet entity.Wallet

	err := row.Scan(
		&contract.Id, &contract.Name, &contract.Address, &contract.YieldRate, &contract.Term, &contract.MinDeposit, &contract.PenaltyRate,
		&vault.Id, &vault.Name,
		&vaultCategory.Id, &vaultCategory.Name,
		&wallet.Id, &wallet.Type, &wallet.Funded,
		&wallet.Key.Id, &wallet.Key.PublicKey, &wallet.Key.Weight,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return entity.Contract{}, fmt.Errorf("ContractRepo - GetContractById - Contract not found")
		}
		return entity.Contract{}, fmt.Errorf("ContractRepo - GetContractById - row.Scan: %w", err)
	}

	vault.Wallet = wallet
	vault.VaultCategory = vaultCategory
	contract.Asset = asset
	contract.Vault = vault

	return contract, nil
}

func (r ContractRepo) CreateContract(data entity.Contract) (entity.Contract, error) {
	res := data
	stmt := `INSERT INTO Contract (name, address, yield_rate, term, min_deposit, penalty_rate, vault_id, asset_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id;`
	err := r.Db.QueryRow(stmt, data.Name, data.Address, data.YieldRate, data.Term, data.MinDeposit, data.PenaltyRate, data.Vault.Id, data.Asset.Id).Scan(&res.Id)
	if err != nil {
		return entity.Contract{}, fmt.Errorf("ContractRepo - Contract - db.QueryRow: %w", err)
	}

	return res, nil
}
