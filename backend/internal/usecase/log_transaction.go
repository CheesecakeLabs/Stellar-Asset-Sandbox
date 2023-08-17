package usecase

import "github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"

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
