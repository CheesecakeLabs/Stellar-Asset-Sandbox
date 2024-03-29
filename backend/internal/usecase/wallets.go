package usecase

import (
	"fmt"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
)

type WalletUseCase struct {
	repo WalletRepoInterface
}

func NewWalletUseCase(r WalletRepoInterface) *WalletUseCase {
	return &WalletUseCase{
		repo: r,
	}
}

func (uc *WalletUseCase) Get(id int) (entity.Wallet, error) {
	wallet, err := uc.repo.GetWallet(id)
	if err != nil {
		return entity.Wallet{}, fmt.Errorf("WalletUseCase - Get - uc.repo.GetWallet: %w", err)
	}

	wallet.Key, err = uc.repo.GetKeyByWallet(wallet.Id)
	if err != nil {
		return entity.Wallet{}, fmt.Errorf("WalletUseCase - Get - uc.repo.GetKey: %w", err)
	}

	return wallet, nil
}

func (uc *WalletUseCase) List(wType string) ([]entity.Wallet, error) {
	wallets, err := uc.repo.GetWallets(wType)
	if err != nil {
		return nil, fmt.Errorf("WalletUseCase - List - uc.repo.GetWallets: %w", err)
	}
	return wallets, nil
}

func (uc *WalletUseCase) Create(data entity.Wallet) (entity.Wallet, error) {
	wallet, err := uc.repo.CreateWalletWithKey(data)
	if err != nil {
		return entity.Wallet{}, fmt.Errorf("WalletUseCase - Create - uc.repo.CreateWalletWithKey: %w", err)
	}
	return wallet, nil
}

func (uc *WalletUseCase) Update(data entity.Wallet) (entity.Wallet, error) {
	wallet, err := uc.repo.UpdateWallet(data)
	if err != nil {
		return entity.Wallet{}, fmt.Errorf("WalletUseCase - Update - uc.repo.UpdateWallet: %w", err)
	}
	return wallet, nil
}

func (uc *WalletUseCase) GetWalletsByType(wType string) ([]entity.Wallet, error) {
	wallets, err := uc.repo.GetWallets(wType)
	if err != nil {
		return nil, fmt.Errorf("WalletUseCase - GetAll - uc.repo.GetAllWallets: %w", err)
	}
	return wallets, nil
}
