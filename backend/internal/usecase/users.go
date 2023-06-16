package usecase

import (
	"fmt"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"golang.org/x/crypto/bcrypt"
)

// User Use Case -.
type UserUseCase struct {
	repo         UserRepo
	jwtSecretKey string
}

// New -.
func NewUserUseCase(r UserRepo, k string) *UserUseCase {
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
	if user.Password == "" {
		return fmt.Errorf("password is empty")
	}
	user.Password, err = uc.HashPassword(user.Password)
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
	err = uc.CheckPassword(user, password)
	if err != nil {
		return
	}
	return
}

func (uc *UserUseCase) HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		return "", err
	}
	return string(bytes), nil
}

func (uc *UserUseCase) CheckPassword(user entity.User, providedPassword string) error {
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(providedPassword))
	if err != nil {
		return err
	}
	return nil
}


func (uc *UserUseCase) GetUserByToken(token string) (user entity.User, err error) {
	user, err = uc.repo.GetUserByToken(token)
	if err != nil {
		return entity.User{}, err
	}
	return user, nil
}
