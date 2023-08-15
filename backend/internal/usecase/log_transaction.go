package usecase

type LogTransactionUseCase struct {
	lRepo LogTransactionRepoInterface
	aRepo AssetRepoInterface
}

func NewLogTransactionUseCase(lRepo LogTransactionRepoInterface, aRepo AssetRepoInterface) *LogTransactionUseCase {
	return &LogTransactionUseCase{lRepo, aRepo}
}
