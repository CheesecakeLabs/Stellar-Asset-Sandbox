// Package usecase implements application business logic. Each logic group in own file.
package usecase

import "github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"

type (
	// UserRepo -.
	UserRepo interface {
		GetUser(name string) (entity.User, error)
		CreateUser(user entity.User) error
		UpdateToken(id string, token string) error
		ValidateToken(token string) error
	}

	// User -.
	User interface {
		Detail(name string) (entity.User, error)
		CreateUser(user entity.User) error
		Autentication(name string, password string) (User, error)
	}
)
