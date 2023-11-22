package usecase

import (
	"fmt"
	"strings"

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

func (uc *UserUseCase) GetAllUsers(ID string) ([]entity.UserResponse, error) {
	users, err := uc.repo.GetAllUsers(ID)
	if err != nil {
		return users, err
	}

	// Iterate over users and modify the Name and Email fields
	for i := range users {
		users[i].Name = formatName(users[i].Name)
		users[i].Email = obfuscateEmail(users[i].Email)
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

func (uc *UserUseCase) GetProfile(token string) (entity.UserResponse, error) {
	profile, err := uc.repo.GetProfile(token)
	if err != nil {
		return profile, err
	}

	return profile, nil
}

// Helper function to format the name
func formatName(name string) string {
	nameParts := strings.Split(name, " ")
	if len(nameParts) > 1 {
		return nameParts[0] + " " + string(nameParts[1][0]) + "."
	}
	return name
}

// Helper function to obfuscate the email
func obfuscateEmail(email string) string {
	atIndex := strings.Index(email, "@")
	if atIndex > 1 {
		return string(email[0]) + strings.Repeat("*", atIndex-2) + string(email[atIndex-1:])
	}
	return email
}
