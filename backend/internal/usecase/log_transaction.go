package usecase

import (
	"time"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
)

type LogTransactionUseCase struct {
	lRepo LogTransactionRepoInterface
}

func NewLogTransactionUseCase(lRepo LogTransactionRepoInterface) *LogTransactionUseCase {
	return &LogTransactionUseCase{lRepo}
}

func (l *LogTransactionUseCase) CreateLogTransaction(logTransaction entity.LogTransaction) error {
	err := l.lRepo.StoreLogTransaction(logTransaction)
	if err != nil {
		return err
	}
	return nil
}

func (l *LogTransactionUseCase) GetLogTransactionsByAssetID(assetId int, timeRange string) ([]entity.LogTransaction, error) {
	logTransactions, err := l.lRepo.GetLogTransactionsByAssetID(assetId, timeRange)
	if err != nil {
		return nil, err
	}
	return logTransactions, nil
}

func (l *LogTransactionUseCase) GetLogTransactionsByUserID(userId int, timeRange string) ([]entity.LogTransaction, error) {
	logTransactions, err := l.lRepo.GetLogTransactionsByUserID(userId, timeRange)
	if err != nil {
		return nil, err
	}
	return logTransactions, nil
}

func (l *LogTransactionUseCase) GetLogTransactions(timeRange string) ([]entity.LogTransaction, error) {
	logTransactions, err := l.lRepo.GetLogTransactions(timeRange)
	if err != nil {
		return nil, err
	}
	return logTransactions, nil
}

func (l *LogTransactionUseCase) GetLogTransactionsByTransactionTypeID(transactionTypeID int, timeRange string) ([]entity.LogTransaction, error) {
	logTransactions, err := l.lRepo.GetLogTransactionsByTransactionTypeID(transactionTypeID, timeRange)
	if err != nil {
		return nil, err
	}
	return logTransactions, nil
}

func (l *LogTransactionUseCase) SumLogTransactions(timeRange string, timeFrame time.Duration) ([]entity.SumLogTransaction, error) {
	sum, err := l.lRepo.SumLogTransactions(timeRange, timeFrame)
	if err != nil {
		return []entity.SumLogTransaction{}, err
	}
	return sum, nil
}

func (l *LogTransactionUseCase) SumLogTransactionsByAssetID(assetID int, timeRange string, duration time.Duration, transactionType int) (entity.SumLogTransaction, error) {
	sum, err := l.lRepo.SumLogTransactionsByAssetID(assetID, timeRange, duration, transactionType)
	if err != nil {
		return entity.SumLogTransaction{}, err
	}
	return sum, nil
}

func (l *LogTransactionUseCase) GetLastLogTransactions(transactionTypeID int) ([]entity.LogTransaction, error) {
	logTransactions, err := l.lRepo.GetLastLogTransactions(transactionTypeID)
	if err != nil {
		return nil, err
	}
	return logTransactions, nil
}

func (l *LogTransactionUseCase) SumLogTransactionsSupply(timeRange string, timeFrame time.Duration) ([]entity.SumLogTransactionSupply, error) {
	sum, err := l.lRepo.SumLogTransactionSupply(timeRange, timeFrame)
	if err != nil {
		return []entity.SumLogTransactionSupply{}, err
	}
	return sum, nil
}

func (l *LogTransactionUseCase) LogTransactionsSupplyByAssetID(assetID int, timeRange string, periodInitial string, interval string) (entity.LogTransactionSupply, error) {
	sum, err := l.lRepo.LogTransactionSupplyByAssetID(assetID, timeRange, periodInitial, interval)
	if err != nil {
		return entity.LogTransactionSupply{}, err
	}
	return sum, nil
}
