package usecase

import (
	"fmt"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/usecase/repo"
	"golang.org/x/crypto/bcrypt"
)

// User Use Case -.
type UserUseCase struct {
	repo         repo.UserRepo
	jwtSecretKey string
}

// New -.
func NewUserUseCase(r repo.UserRepo, k string) *UserUseCase {
	return &UserUseCase{
		repo:         r,
		jwtSecretKey: k,
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

// CreateUser - creating user.
func (uc *UserUseCase) CreateUser(user entity.User) error {
	var err error
	user.Password, err = uc.hashPassword(user.Password)
	if err != nil {
		return err
	}
	uc.repo.CreateUser(user)
	return nil
}

func (uc *UserUseCase) Autentication(name string, password string) (user entity.User, err error) {
	user, err = uc.repo.GetUser(name)
	if err != nil {
		return user, err
	}
	err = uc.checkPassword(user, password)
	if err != nil {
		return
	}
	return
}

func (uc *UserUseCase) hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		return "", err
	}
	return string(bytes), nil
}

func (uc *UserUseCase) checkPassword(user entity.User, providedPassword string) error {
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(providedPassword))
	if err != nil {
		return err
	}
	return nil
}
