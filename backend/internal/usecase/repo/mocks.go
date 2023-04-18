package repo

import (
	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/stretchr/testify/mock"
)

// define MockUserRepo that implements UserRepoInterface
type MockUserRepo struct {
	mock.Mock
}

// define interface with all methods of UserRepo
type UserRepoInterface interface {
	GetUser(name string) (entity.User, error)
	CreateUser(user entity.User) error
	UpdateToken(id string, token string) error
	ValidateToken(token string) error
}

func (m *MockUserRepo) CreateUser(user entity.User) error {
	args := m.Called(user)
	return args.Error(0)
}

func (m *MockUserRepo) GetUser(name string) (entity.User, error) {
	args := m.Called(name)
	return args.Get(0).(entity.User), args.Error(1)
}

func (m *MockUserRepo) UpdateToken(id string, token string) error {
	args := m.Called(id, token)
	return args.Error(0)
}

func (m *MockUserRepo) ValidateToken(token string) error {
	args := m.Called(token)
	return args.Error(0)
}
