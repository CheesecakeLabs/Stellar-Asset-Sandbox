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
			c.compound AS contract_compound, c.created_at AS contract_created_at, v.id AS vault_id, v.name AS vault_name,
			vc.id AS vault_category_id, vc.name as vault_category_name,
			w.id AS wallet_id, w.type AS wallet_type, w.funded AS wallet_funded,
			wk.id AS wallet_key_id, wk.public_key AS wallet_key_public_key, wk.weight AS wallet_key_weight,
			a.id AS asset_id, a.name AS asset_name, a.asset_type, a.code as asset_code, a.image,
			d.id AS distributor_id, d.type AS distributor_type, d.funded AS distributor_funded,
			dk.id AS distributor_key_id, dk.public_key AS distributor_key_public_key, dk.weight AS distributor_key_weight,
			i.id AS issuer_id, i.type AS issuer_type, i.funded AS issuer_funded,
			ik.id AS issuer_key_id, ik.public_key AS issuer_key_public_key, ik.weight AS issuer_key_weight
		FROM contracts c
		JOIN vault v ON c.vault_id = v.id
		JOIN vaultcategory vc ON v.vault_category_id = vc.id
		JOIN wallet w ON v.wallet_id = w.id
		JOIN key wk ON w.id = wk.wallet_id
		JOIN asset a ON a.id = c.asset_id
		JOIN wallet d ON a.distributor_id = d.id
		JOIN key dk ON d.id = dk.wallet_id
		JOIN wallet i ON a.issuer_id = i.id
		JOIN key ik ON i.id = ik.wallet_id
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
		var assetDistributor entity.Wallet
		var assetIssuer entity.Wallet

		err := rows.Scan(
			&contract.Id, &contract.Name, &contract.Address, &contract.YieldRate, &contract.Term, &contract.MinDeposit,
			&contract.PenaltyRate, &contract.Compound, &contract.CreatedAt,
			&vault.Id, &vault.Name,
			&vaultCategory.Id, &vaultCategory.Name,
			&wallet.Id, &wallet.Type, &wallet.Funded,
			&wallet.Key.Id, &wallet.Key.PublicKey, &wallet.Key.Weight,
			&asset.Id, &asset.Name, &asset.AssetType, &asset.Code, &asset.Image,
			&assetDistributor.Id, &assetDistributor.Type, &assetDistributor.Funded,
			&assetDistributor.Key.Id, &assetDistributor.Key.PublicKey, &assetDistributor.Key.Weight,
			&assetIssuer.Id, &assetIssuer.Type, &assetIssuer.Funded,
			&assetIssuer.Key.Id, &assetIssuer.Key.PublicKey, &assetIssuer.Key.Weight,
		)
		if err != nil {
			return nil, fmt.Errorf("ContractRepo - GetContractCategories - row.Scan: %w", err)
		}

		vault.Wallet = wallet
		vault.VaultCategory = &vaultCategory
		asset.Distributor = assetDistributor
		asset.Issuer = assetIssuer
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
		c.compound AS contract_compound, c.created_at AS contract_created_at, v.id AS vault_id, v.name AS vault_name,
		vc.id AS vault_category_id, vc.name as vault_category_name,
		w.id AS wallet_id, w.type AS wallet_type, w.funded AS wallet_funded,
		wk.id AS wallet_key_id, wk.public_key AS wallet_key_public_key, wk.weight AS wallet_key_weight,
		a.id AS asset_id, a.name AS asset_name, a.asset_type, a.code as asset_code, a.image,
		d.id AS distributor_id, d.type AS distributor_type, d.funded AS distributor_funded,
		dk.id AS distributor_key_id, dk.public_key AS distributor_key_public_key, dk.weight AS distributor_key_weight,
		i.id AS issuer_id, i.type AS issuer_type, i.funded AS issuer_funded,
		ik.id AS issuer_key_id, ik.public_key AS issuer_key_public_key, ik.weight AS issuer_key_weight
		FROM contracts c
		JOIN vault v ON c.vault_id = v.id
		JOIN vaultcategory vc ON v.vault_category_id = vc.id
		JOIN wallet w ON v.wallet_id = w.id
		JOIN key wk ON w.id = wk.wallet_id
		JOIN asset a ON a.id = c.asset_id
		JOIN wallet d ON a.distributor_id = d.id
		JOIN key dk ON d.id = dk.wallet_id
		JOIN wallet i ON a.issuer_id = i.id
		JOIN key ik ON i.id = ik.wallet_id
		WHERE c.id = $1;
	`

	row := r.Db.QueryRow(query, id)

	var contract entity.Contract
	var vaultCategory entity.VaultCategory
	var vault entity.Vault
	var asset entity.Asset
	var wallet entity.Wallet
	var assetDistributor entity.Wallet
	var assetIssuer entity.Wallet

	err := row.Scan(
		&contract.Id, &contract.Name, &contract.Address, &contract.YieldRate, &contract.Term, &contract.MinDeposit,
		&contract.PenaltyRate, &contract.Compound, &contract.CreatedAt,
		&vault.Id, &vault.Name,
		&vaultCategory.Id, &vaultCategory.Name,
		&wallet.Id, &wallet.Type, &wallet.Funded,
		&wallet.Key.Id, &wallet.Key.PublicKey, &wallet.Key.Weight,
		&asset.Id, &asset.Name, &asset.AssetType, &asset.Code, &asset.Image,
		&assetDistributor.Id, &assetDistributor.Type, &assetDistributor.Funded,
		&assetDistributor.Key.Id, &assetDistributor.Key.PublicKey, &assetDistributor.Key.Weight,
		&assetIssuer.Id, &assetIssuer.Type, &assetIssuer.Funded,
		&assetIssuer.Key.Id, &assetIssuer.Key.PublicKey, &assetIssuer.Key.Weight,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return entity.Contract{}, fmt.Errorf("ContractRepo - GetContractById - Contract not found")
		}
		return entity.Contract{}, fmt.Errorf("ContractRepo - GetContractById - row.Scan: %w", err)
	}

	vault.Wallet = wallet
	vault.VaultCategory = &vaultCategory
	asset.Distributor = assetDistributor
	asset.Issuer = assetIssuer
	contract.Asset = asset
	contract.Vault = vault

	return contract, nil
}

func (r ContractRepo) CreateContract(data entity.Contract) (entity.Contract, error) {
	res := data
	stmt := `INSERT INTO Contracts (name, address, yield_rate, term, min_deposit, penalty_rate, compound, vault_id, asset_id) 
			 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id;`

	err := r.Db.QueryRow(stmt, data.Name, data.Address, data.YieldRate, data.Term, data.MinDeposit,
		data.PenaltyRate, data.Compound, data.Vault.Id, data.Asset.Id).Scan(&res.Id)

	if err != nil {
		return entity.Contract{}, fmt.Errorf("ContractRepo - Contract - db.QueryRow: %w", err)
	}

	return res, nil
}

func (r ContractRepo) GetPaginatedContracts(page, limit int) ([]entity.Contract, error) {
	offset := (page - 1) * limit
	query := `
		SELECT 
			c.id AS contract_id, c.name AS contract_name, c.address AS contract_address, 
			c.yield_rate AS contract_yield_rate, c.term AS contract_term, 
			c.min_deposit AS contract_min_deposit, c.penalty_rate AS contract_penalty_rate,
			c.compound AS contract_compound, c.created_at AS contract_created_at,
			v.id AS vault_id, v.name AS vault_name,
			vc.id AS vault_category_id, vc.name as vault_category_name,
			w.id AS wallet_id, w.type AS wallet_type, w.funded AS wallet_funded,
			wk.id AS wallet_key_id, wk.public_key AS wallet_key_public_key, wk.weight AS wallet_key_weight
		FROM contracts c
		JOIN vault v ON c.vault_id = v.id
		JOIN vaultcategory vc ON v.vault_category_id = vc.id
		JOIN wallet w ON v.wallet_id = w.id
		JOIN key wk ON w.id = wk.wallet_id
		ORDER BY c.id DESC
		LIMIT $1 OFFSET $2;
	`

	rows, err := r.Db.Query(query, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("ContractRepo - GetPaginatedContracts - Query: %w", err)
	}
	defer rows.Close()

	var contracts []entity.Contract

	for rows.Next() {
		var contract entity.Contract
		var vaultCategory entity.VaultCategory
		var vault entity.Vault
		var wallet entity.Wallet

		err := rows.Scan(
			&contract.Id, &contract.Name, &contract.Address, &contract.YieldRate,
			&contract.Term, &contract.MinDeposit, &contract.PenaltyRate, &contract.Compound, &contract.CreatedAt,
			&vault.Id, &vault.Name,
			&vaultCategory.Id, &vaultCategory.Name,
			&wallet.Id, &wallet.Type, &wallet.Funded,
			&wallet.Key.Id, &wallet.Key.PublicKey, &wallet.Key.Weight,
		)
		if err != nil {
			return nil, fmt.Errorf("ContractRepo - GetPaginatedContracts - row.Scan: %w", err)
		}

		vault.Wallet = wallet
		vault.VaultCategory = &vaultCategory
		contract.Vault = vault

		contracts = append(contracts, contract)
	}

	return contracts, nil
}

func (r ContractRepo) GetHistory(userId int, contractId int) ([]entity.ContractHistory, error) {
	query := `
		SELECT ch.id, ch.deposited_at, ch.deposit_amount, ch.withdrawn_at, ch.withdraw_amount, ch.deposited_at 
		FROM contractshistory ch
		WHERE ch.user_id = $1 AND ch.contract_id = $2
		ORDER BY ch.deposited_at DESC;
	`

	rows, err := r.Db.Query(query, userId, contractId)
	if err != nil {
		return nil, fmt.Errorf("ContractRepo - GetHistory - Query: %w", err)
	}
	defer rows.Close()

	contractsHistory := []entity.ContractHistory{}

	for rows.Next() {
		var contractHistory entity.ContractHistory

		err := rows.Scan(
			&contractHistory.Id, &contractHistory.DepositedAt, &contractHistory.DepositAmount, &contractHistory.WithdrawnAt,
			&contractHistory.WithdrawAmount, &contractHistory.DepositedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("ContractRepo - GetContractCategories - row.Scan: %w", err)
		}

		contractsHistory = append(contractsHistory, contractHistory)
	}

	return contractsHistory, nil
}

func (r ContractRepo) AddContractHistory(data entity.ContractHistory) (entity.ContractHistory, error) {
	res := data
	stmt := `INSERT INTO contractshistory (deposit_amount, contract_id, user_id) 
			 VALUES ($1, $2, $3) RETURNING id;`

	err := r.Db.QueryRow(stmt, data.DepositAmount, data.Contract.Id, data.User.ID).Scan(&res.Id)

	if err != nil {
		return entity.ContractHistory{}, fmt.Errorf("ContractRepo - addContractHistory - db.QueryRow: %w", err)
	}

	return res, nil
}

func (r ContractRepo) UpdateContractHistory(data entity.ContractHistory) (entity.ContractHistory, error) {
	res := data
	stmt := `UPDATE ContractsHistory SET withdraw_amount = $1, withdrawn_at = now() WHERE id = (
			 SELECT id
			 FROM ContractsHistory
			 WHERE withdraw_amount IS NULL AND contract_id = $2 AND user_id = $3
			 ORDER BY id DESC
			 LIMIT 1) RETURNING id;`

	err := r.Db.QueryRow(stmt, data.WithdrawAmount, data.Contract.Id, data.User.ID).Scan(&res.Id)

	if err != nil {
		return entity.ContractHistory{}, fmt.Errorf("ContractRepo - updateContractHistory - db.QueryRow: %w", err)
	}

	return res, nil
}
