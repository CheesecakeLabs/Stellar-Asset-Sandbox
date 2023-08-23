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
	stmp := `INSERT INTO logtransactions (user_id, transaction_type_id, asset_id, amount, description) VALUES ($1, $2, $3, $4, $5)`
	_, err := repo.Db.Exec(stmp, log.UserID, log.TransactionTypeID, log.Asset.Id, log.Amount, log.Description)
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

func (repo *LogTransactionRepo) SumLogTransactionsByAssetID(assetID int, timeRange string, timeFrame time.Duration, transactionType int) (entity.SumLogTransaction, error) {
	dateFilter, err := getDateFilter(timeRange)
	if err != nil {
		return entity.SumLogTransaction{}, err
	}

	timeFrameUnit := getTimeFrame(timeFrame)
	timeFrameSeconds := timeFrame.Seconds()

	baseQuery := `
        SELECT
            a.id, a.name, a.code, a.asset_type, SUM(lt.amount),
            DATE_TRUNC($3, TIMESTAMP 'epoch' + INTERVAL '1 second' * floor(EXTRACT(EPOCH FROM lt.date)/$4) * $4) as dateFrame,
			COUNT(lt.amount) as quantity
        FROM logtransactions AS lt
        JOIN asset AS a ON lt.asset_id = a.id
	`

	var whereClause string
	var queryArgs []interface{}

	if transactionType == 0 {
		whereClause = "WHERE lt.date >= $1 AND lt.asset_id = $2"
		queryArgs = append(queryArgs, dateFilter, assetID, timeFrameUnit, timeFrameSeconds)
	} else {
		whereClause = "WHERE lt.date >= $1 AND lt.asset_id = $2 AND lt.transaction_type_id = $5"
		queryArgs = append(queryArgs, dateFilter, assetID, timeFrameUnit, timeFrameSeconds, transactionType)
	}

	groupAndOrderClause := `
        GROUP BY a.id, dateFrame
        ORDER BY a.id, dateFrame;
	`

	query := baseQuery + whereClause + groupAndOrderClause

	rows, err := repo.Db.Query(query, queryArgs...)
	if err != nil {
		return entity.SumLogTransaction{}, err
	}
	defer rows.Close()

	var sumLogTransaction entity.SumLogTransaction
	for rows.Next() {
		var asset entity.Asset
		var amount float64
		var quantity int
		var date string
		err := rows.Scan(&asset.Id, &asset.Name, &asset.Code, &asset.AssetType, &amount, &date, &quantity)
		if err != nil {
			return entity.SumLogTransaction{}, err
		}

		sumLogTransaction.Asset = asset
		sumLogTransaction.Amount = append(sumLogTransaction.Amount, amount)
		sumLogTransaction.Quantity = append(sumLogTransaction.Quantity, quantity)
		sumLogTransaction.Date = append(sumLogTransaction.Date, date)
		sumLogTransaction.Asset.Amount += int(amount)
	}

	return sumLogTransaction, nil
}

func (repo *LogTransactionRepo) SumLogTransactions(timeRange string, timeFrame time.Duration) ([]entity.SumLogTransaction, error) {
	dateFilter, err := getDateFilter(timeRange)
	if err != nil {
		return []entity.SumLogTransaction{}, err
	}

	timeFrameUnit := getTimeFrame(timeFrame)
	timeFrameSeconds := timeFrame.Seconds()

	query := `
        SELECT
            a.id, a.name, a.code, a.asset_type, SUM(lt.amount),
            DATE_TRUNC($2, TIMESTAMP 'epoch' + INTERVAL '1 second' * floor(EXTRACT(EPOCH FROM lt.date)/$3) * $3) as dateFrame
        FROM logtransactions AS lt
        JOIN asset AS a ON lt.asset_id = a.id
        WHERE lt.date >= $1
        GROUP BY a.id, dateFrame
        ORDER BY a.id, dateFrame;
    `

	rows, err := repo.Db.Query(query, dateFilter, timeFrameUnit, timeFrameSeconds)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var sums []entity.SumLogTransaction
	var currentAsset entity.Asset
	var sumLogTransaction entity.SumLogTransaction
	for rows.Next() {
		var asset entity.Asset
		var amount float64
		var date string
		err := rows.Scan(&asset.Id, &asset.Name, &asset.Code, &asset.AssetType, &amount, &date)
		if err != nil {
			return nil, err
		}

		if asset.Id != currentAsset.Id && currentAsset.Id != 0 {
			sums = append(sums, sumLogTransaction)
			sumLogTransaction = entity.SumLogTransaction{}
		}

		sumLogTransaction.Asset = asset
		sumLogTransaction.Amount = append(sumLogTransaction.Amount, amount)
		sumLogTransaction.Date = append(sumLogTransaction.Date, date)
		sumLogTransaction.Asset.Amount += int(amount)
		currentAsset = asset
	}

	if currentAsset.Id != 0 {
		sums = append(sums, sumLogTransaction)
	}

	return sums, nil
}

func getLogTransactions(repo *LogTransactionRepo, timeRange string, whereClause string) ([]entity.LogTransaction, error) {
	dateFilter, err := getDateFilter(timeRange)
	if err != nil {
		return nil, err
	}
	query := `
		SELECT lt.log_id, lt.user_id, lt.transaction_type_id, a.id, a.name, a.code, a.distributor_id, a.issuer_id, a.asset_type, lt.amount, lt.date, lt.description
		FROM logtransactions AS lt
		JOIN Asset AS a ON lt.asset_id = a.id
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
		var distributorID, issuerID int
		err := rows.Scan(&log.LogID, &log.UserID, &log.TransactionTypeID, &log.Asset.Id, &log.Asset.Name, &log.Asset.Code, &distributorID, &issuerID, &log.Asset.AssetType, &log.Amount, &log.Date, &log.Description)
		if err != nil {
			return nil, err
		}
		log.Asset.Distributor.Id = distributorID
		log.Asset.Issuer.Id = issuerID
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

	currentTime := time.Now()
	switch unit {
	case 'h':
		return currentTime.Add(time.Duration(-value) * time.Hour), nil
	case 'd':
		// If value is 1, return the start of the current day.
		if value == 1 {
			return time.Date(currentTime.Year(), currentTime.Month(), currentTime.Day(), 0, 0, 0, 0, currentTime.Location()), nil
		}

		targetDate := currentTime.AddDate(0, 0, -value+1)
		return time.Date(targetDate.Year(), targetDate.Month(), targetDate.Day(), 0, 0, 0, 0, targetDate.Location()), nil
	default:
		return time.Time{}, fmt.Errorf("invalid time unit in time range")
	}
}

func getTimeFrame(timeFrame time.Duration) string {
	var timeFrameUnit string
	if timeFrame.Hours() >= 24 {
		timeFrameUnit = "day"
	} else if timeFrame.Hours() >= 1 {
		timeFrameUnit = "hour"
	} else {
		timeFrameUnit = "minute"
	}
	return timeFrameUnit
}
