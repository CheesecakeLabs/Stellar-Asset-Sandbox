package repo

import (
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

func (r WalletRepo) GetWallets(wType string) ([]entity.Wallet, error) {
	stmt := `SELECT * FROM Wallet WHERE type=$1`
	rows, err := r.Db.Query(stmt, wType)

	if err != nil {
		return nil, fmt.Errorf("WalletRepo - GetWallets - db.Query: %w", err)
	}

	defer rows.Close()

	entities := make([]entity.Wallet, 0, _defaultEntityCap)

	for rows.Next() {
		var wallet entity.Wallet

		err = rows.Scan(&wallet.Id, &wallet.Type)
		if err != nil {
			return nil, fmt.Errorf("WalletRepo - GetWallets - rows.Scan: %w", err)
		}

		entities = append(entities, wallet)
	}

	return entities, nil
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
