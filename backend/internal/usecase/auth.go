package usecase

import "github.com/CheesecakeLabs/token-factory-v2/backend/internal/usecase/repo"

// Auth Use Case
type AuthUseCase struct {
	repo         repo.UserRepo
	jwtSecretKey string
}

// New -.
func NewAuthUseCase(r repo.UserRepo, k string) *AuthUseCase {
	return &AuthUseCase{
		repo:         r,
		jwtSecretKey: k,
	}
}

func (uc *AuthUseCase) UpdateToken(id string, token string) error {
	err := uc.repo.UpdateToken(id, token)
	if err != nil {
		return err
	}
	return nil
}

func (uc *AuthUseCase) ValidateToken(id string, token string) error {
	err := uc.repo.ValidateToken(id, token)
	if err != nil {
		return err
	}
	return nil
}

func (uc *AuthUseCase) GetJWTSecretKey() string {
	return uc.jwtSecretKey
}
