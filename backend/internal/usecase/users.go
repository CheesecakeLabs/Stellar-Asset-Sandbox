package usecase

import (
	"crypto/rand"
	"encoding/hex"
	"errors"
	"fmt"
	"time"

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

func (uc *UserUseCase) generateResetToken() (string, error) {
	token := make([]byte, 16)
	_, err := rand.Read(token)
	if err != nil {
		return "", err
	}
	return hex.EncodeToString(token), nil
}

// History - getting translate history from store.
func (uc *UserUseCase) Detail(email string) (entity.User, error) {
	user, err := uc.repo.GetUser(email)
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

	err = uc.repo.CreateUser(user)
	if err != nil {
		return err
	}
	return nil
}

func (uc *UserUseCase) Autentication(email string, password string) (user entity.User, err error) {
	user, err = uc.repo.GetUser(email)
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

// CheckPassword checks if the provided password matches the user's password
func (uc *UserUseCase) CheckPassword(user entity.User, providedPassword string) error {
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(providedPassword))
	if err != nil {
		return err
	}
	return nil
}

// GetUserByToken returns the user with the given token
func (uc *UserUseCase) GetUserByToken(token string) (user entity.User, err error) {
	user, err = uc.repo.GetUserByToken(token)
	if err != nil {
		return entity.User{}, err
	}
	return user, nil
}

// GetAllUsers returns all users
func (uc *UserUseCase) GetAllUsers() ([]entity.UserResponse, error) {
	users, err := uc.repo.GetAllUsers()
	if err != nil {
		return users, err
	}

	return users, nil
}

func (uc *UserUseCase) EditUsersRole(userRole entity.UserRole) error {
	err := uc.repo.EditUsersRole(userRole.ID_user, userRole.ID_role)
	if err != nil {
		return err
	}
	return nil
}

// GetProfile returns the user's profile information
func (uc *UserUseCase) GetProfile(token string) (entity.UserResponse, error) {
	profile, err := uc.repo.GetProfile(token)
	if err != nil {
		return profile, err
	}

	return profile, nil
}

// RequestPasswordReset generates a reset token and sends an email to the user
func (uc *UserUseCase) RequestPasswordReset(email string) error {
	// Generate a reset token
	token := generateResetToken()
	expiry := time.Now().Add(1 * time.Hour) // Token valid for 1 hour

	// Store the reset token and its expiry in the database
	err := uc.repo.SetResetToken(email, token, expiry)
	if err != nil {
		return err
	}

	// TODO: Send an email to the user with the reset link containing the token

	return nil
}

// ValidateResetToken checks if the provided token is valid and hasn't expired
func (uc *UserUseCase) ValidateResetToken(email string, token string) (bool, error) {
	// TODO: Fetch the stored token and expiration time from the database for the given email

	// Compare the provided token with the stored token
	if token != storedToken {
		return false, errors.New("Invalid token")
	}

	// Check if the token has expired
	if time.Now().After(storedExpirationTime) {
		return false, errors.New("Token has expired")
	}

	return true, nil
}

// UpdatePassword updates the user's password in the database
func (uc *UserUseCase) UpdatePassword(email string, newPassword string) error {
	return uc.repo.UpdateUserPassword(email, newPassword)
}
