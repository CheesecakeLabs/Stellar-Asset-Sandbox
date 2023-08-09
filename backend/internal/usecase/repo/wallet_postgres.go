package repo

import (
	"database/sql"
	"fmt"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/CheesecakeLabs/token-factory-v2/backend/pkg/postgres"
)

const _defaultEntityCap = 64

type WalletRepo struct {
	*postgres.Postgres
}

func NewWalletRepo(pg *postgres.Postgres) WalletRepo {
	return WalletRepo{pg}
}

func (r WalletRepo) GetWallet(id int) (entity.Wallet, error) {
	stmt := `SELECT * FROM wallet WHERE id=$1`
	row := r.Db.QueryRow(stmt, id)

	var wallet entity.Wallet
	err := row.Scan(&wallet.Id, &wallet.Type, &wallet.Funded)
	if err != nil {
		if err == sql.ErrNoRows {
			return entity.Wallet{}, fmt.Errorf("WalletRepo - GetWallet - wallet not found")
		}
		return entity.Wallet{}, fmt.Errorf("WalletRepo - GetWallet - row.Scan: %w", err)
	}

	return wallet, nil
}

func (r WalletRepo) GetWallets(wType string) ([]entity.Wallet, error) {
	stmt := `SELECT wallet.*, key.* FROM Wallet LEFT JOIN Key ON wallet.id = key.wallet_id WHERE wallet.type=$1`
	rows, err := r.Db.Query(stmt, wType)
	if err != nil {
		return nil, fmt.Errorf("WalletRepo - GetWallets - db.Query: %w", err)
	}
	defer rows.Close()

	var wallets []entity.Wallet

	for rows.Next() {
		var wallet entity.Wallet
		var key entity.Key

		err = rows.Scan(&wallet.Id, &wallet.Type, &wallet.Funded, &key.Id, &key.PublicKey, &key.Weight, &key.WalletId)
		if err != nil {
			return nil, fmt.Errorf("WalletRepo - GetWallets - rows.Scan: %w", err)
		}

		wallet.Key = key
		wallets = append(wallets, wallet)
	}

	return wallets, nil
}

func (r WalletRepo) GetKeyByWallet(walletId int) (entity.Key, error) {
	stmt := `SELECT * FROM key WHERE wallet_id=$1`
	row := r.Db.QueryRow(stmt, walletId)

	var key entity.Key
	err := row.Scan(&key.Id, &key.PublicKey, &key.Weight, &key.WalletId)
	if err != nil {
		if err == sql.ErrNoRows {
			return entity.Key{}, fmt.Errorf("WalletRepo - GetKeyByWallet - key not found")
		}
		return entity.Key{}, fmt.Errorf("WalletRepo - GetKeyByWallet - row.Scan: %w", err)
	}

	return key, nil
}

func (r WalletRepo) CreateWallet(data entity.Wallet) (entity.Wallet, error) {
	res := data
	stmt := `INSERT INTO Wallet (type) VALUES ($1) RETURNING id;`
	err := r.Db.QueryRow(stmt, data.Type).Scan(&res.Id)
	if err != nil {
		return entity.Wallet{}, fmt.Errorf("WalletRepo - CreateWallet - db.QueryRow: %w", err)
	}

	return res, nil
}

func (r WalletRepo) CreateKey(data entity.Key) (entity.Key, error) {
	res := data
	stmt := `INSERT INTO Key (public_key, weight, wallet_id) VALUES ($1, $2, $3) RETURNING id;`
	err := r.Db.QueryRow(stmt, data.PublicKey, data.Weight, data.WalletId).Scan(&res.Id)
	if err != nil {
		return entity.Key{}, fmt.Errorf("WalletRepo - CreateKey - db.QueryRow: %w", err)
	}

	return res, nil
}

func (r WalletRepo) CreateWalletWithKey(data entity.Wallet) (entity.Wallet, error) {
	wallet, err := r.CreateWallet(data)
	if err != nil {
		return entity.Wallet{}, fmt.Errorf("WalletRepo - CreateWalletWithKey - CreateWallet: %w", err)
	}

	wallet.Key.WalletId = wallet.Id
	wallet.Key, err = r.CreateKey(wallet.Key)
	if err != nil {
		return entity.Wallet{}, fmt.Errorf("WalletRepo - CreateWalletWithKey - uc.repo.CreateKey: %w", err)
	}
	return wallet, nil
}

func (r WalletRepo) UpdateWallet(data entity.Wallet) (entity.Wallet, error) {
	stmt := `UPDATE Wallet SET funded=($1) WHERE id=($2);`
	result, err := r.Db.Exec(stmt, data.Funded, data.Id)
	if err != nil {
		return entity.Wallet{}, fmt.Errorf("WalletRepo - UpdateWallet - db.Exec: %v", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return entity.Wallet{}, fmt.Errorf("WalletRepo - UpdateWallet - result.RowsAffected: %v", err)
	}

	if rowsAffected == 0 {
		return entity.Wallet{}, fmt.Errorf("WalletRepo - UpdateWallet - no rows updated")
	}

	return data, nil
}
