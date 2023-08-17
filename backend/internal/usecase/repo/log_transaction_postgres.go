package repo

import (
	"fmt"
	"strconv"
	"time"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/CheesecakeLabs/token-factory-v2/backend/pkg/postgres"
)

type LogTransactionRepo struct {
	*postgres.Postgres
}

func NewLogTransactionRepo(postgres *postgres.Postgres) *LogTransactionRepo {
	return &LogTransactionRepo{postgres}
}

func (repo *LogTransactionRepo) StoreLogTransaction(log entity.LogTransaction) error {
	stmp := `INSERT INTO logtransactions (user_id, transaction_type_id, asset_id, asset_code, asset_issuer ,amount, description) VALUES ($1, $2, $3, $4, $5, $6, $7)`
	_, err := repo.Db.Exec(stmp, log.UserID, log.TransactionTypeID, log.Asset.Id, log.AssetCode, log.AssetIssuer, log.Amount, log.Description)
	if err != nil {
		fmt.Println(err)
		return err
	}

	return nil
}

func (repo *LogTransactionRepo) GetLogTransactions(timeRange string) ([]entity.LogTransaction, error) {
	return getLogTransactions(repo, timeRange, "")
}

func (repo *LogTransactionRepo) GetLogTransactionsByUserID(userID int, timeRange string) ([]entity.LogTransaction, error) {
	return getLogTransactions(repo, timeRange, "WHERE user_id = $2")
}

func (repo *LogTransactionRepo) GetLogTransactionsByAssetID(assetID int, timeRange string) ([]entity.LogTransaction, error) {
	return getLogTransactions(repo, timeRange, "WHERE asset_id = $2")
}

func (repo *LogTransactionRepo) GetLogTransactionsByTransactionTypeID(transactionTypeID int, timeRange string) ([]entity.LogTransaction, error) {
	return getLogTransactions(repo, timeRange, "WHERE transaction_type_id = $2")
}

func getLogTransactions(repo *LogTransactionRepo, timeRange string, whereClause string) ([]entity.LogTransaction, error) {
	dateFilter, err := getDateFilter(timeRange)
	if err != nil {
		return nil, err
	}
	query := `
		SELECT lt.log_id, lt.user_id, lt.transaction_type_id, a.id, a.name, a.code, a.distributor, a.issuer, a.amount, a.asset_type, lt.asset_code, lt.asset_issuer, lt.date, lt.amount, lt.description
		FROM logtransactions AS lt
		JOIN asset AS a ON lt.asset_id = a.id
		WHERE lt.date >= $1 ` + whereClause + `
		ORDER BY lt.date DESC
	`

	rows, err := repo.Db.Query(query, dateFilter)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var logs []entity.LogTransaction
	for rows.Next() {
		var log entity.LogTransaction
		err := rows.Scan(&log.LogID, &log.UserID, &log.TransactionTypeID, &log.Asset.Id, &log.Asset.Name, &log.Asset.Code, &log.Asset.Distributor, &log.Asset.Issuer, &log.Asset.Amount, &log.Asset.AssetType, &log.AssetCode, &log.AssetIssuer, &log.Date, &log.Amount, &log.Description)
		if err != nil {
			return nil, err
		}
		logs = append(logs, log)
	}

	return logs, nil
}

func getDateFilter(timeRange string) (time.Time, error) {
	valueStr := timeRange[:len(timeRange)-1]
	unit := timeRange[len(timeRange)-1]
	value, err := strconv.Atoi(valueStr)
	if err != nil {
		return time.Time{}, fmt.Errorf("invalid numeric value in time range: %s", err.Error())
	}

	var duration time.Duration
	switch unit {
	case 'h':
		duration = time.Duration(-value) * time.Hour
	case 'd':
		duration = time.Duration(-value) * 24 * time.Hour
	default:
		return time.Time{}, fmt.Errorf("invalid time unit in time range")
	}

	return time.Now().Add(duration), nil
}
