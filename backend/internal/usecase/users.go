package usecase

import (
	"fmt"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/usecase/repo"
)

// TranslationUseCase -.
type UserUseCase struct {
	repo repo.UserRepo
}

// New -.
func New(r repo.UserRepo) *UserUseCase {
	return &UserUseCase{
		repo: r,
	}
}

// History - getting translate history from store.
func (uc *UserUseCase) Detail(name string) (entity.User, error) {
	user, err := uc.repo.GetUser(name)
	if err != nil {
		return entity.User{}, fmt.Errorf("TranslationUseCase - History - s.repo.GetHistory: %w", err)
	}

	return user, nil
}
