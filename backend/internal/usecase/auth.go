package usecase

import "github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"

// Auth Use Case
type AuthUseCase struct {
	repo         UserRepo
	jwtSecretKey string
}

// New -.
func NewAuthUseCase(r UserRepo, k string) *AuthUseCase {
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

func (uc *AuthUseCase) ValidateToken() string {
	err := uc.repo.ValidateToken(uc.jwtSecretKey)
	if err != nil {
		return ""
	}
	return uc.jwtSecretKey
}

func (uc *AuthUseCase) GetUserByToken(token string) (entity.User, error) {
	user, err := uc.repo.GetUserByToken(token)
	if err != nil {
		return entity.User{}, err
	}
	return user, nil
}
