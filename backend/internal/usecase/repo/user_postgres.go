package repo

import (
	"errors"
	"fmt"
	"time"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/CheesecakeLabs/token-factory-v2/backend/pkg/postgres"
)

type UserRepo struct {
	*postgres.Postgres
}

func New(pg *postgres.Postgres) UserRepo {
	return UserRepo{pg}
}

func (r UserRepo) GetUser(email string) (entity.User, error) {
	stmt := fmt.Sprintf(`SELECT ID, Name, Password, role_id, Email FROM UserAccount WHERE email='%s'`, email)

	rows, err := r.Db.Query(stmt)
	if err != nil {
		return entity.User{}, fmt.Errorf("UserRepo - GetUser - db.Query: %w", err)
	}

	defer rows.Close()

	for rows.Next() {
		var user entity.User

		err = rows.Scan(&user.ID, &user.Name, &user.Password, &user.RoleId, &user.Email)
		if err != nil {
			return entity.User{}, fmt.Errorf("UserRepo - GetUser - rows.Scan: %w", err)
		}

		return user, nil
	}

	return entity.User{}, nil
}

func (r UserRepo) CreateUser(user entity.User) error {
	stmt := `INSERT INTO UserAccount (name, password, role_id, email, token) VALUES ($1, $2, $3, $4, $5)`
	_, err := r.Db.Exec(stmt, user.Name, user.Password, user.RoleId, user.Email, user.Token)
	if err != nil {
		panic(err)
		// return fmt.Errorf("UserRepo - CreateUser - db.Exec: %w", err)
	}
	fmt.Println("User created successfully")
	return nil
}

func (r UserRepo) UpdateToken(id string, token string) error {
	// insert into if not exists if exist replace
	stmt := `UPDATE UserAccount SET token=$2 WHERE id = $1`
	_, err := r.Db.Exec(stmt, id, token)
	if err != nil {
		// panic(err)
		return fmt.Errorf("UserRepo - UpdateToken - db.Exec: %w", err)
	}
	return nil
}

func (r UserRepo) ValidateToken(token string) error {
	stmt := `SELECT * FROM "UserAccount" WHERE token=$1`

	rows, err := r.Db.Query(stmt, token)
	if err != nil {
		return fmt.Errorf("UserRepo - ValidateToken - db.Query: %w", err)
	}

	defer rows.Close()

	// Check if any row was returned
	if !rows.Next() {
		return errors.New("UserRepo - ValidateToken - no user found for token")
	}

	return nil
}

func (r UserRepo) GetUserByToken(token string) (entity.User, error) {
	stmt := `SELECT ID, Name, Password, role_id, Email FROM UserAccount WHERE token = $1`

	var user entity.User
	err := r.Db.QueryRow(stmt, token).Scan(&user.ID, &user.Name, &user.Password, &user.RoleId, &user.Email)
	if err != nil {
		return entity.User{}, fmt.Errorf("UserRepo - GetUserByToken - db.Query: %w", err)
	}

	return user, nil
}

func (r UserRepo) GetAllUsers() ([]entity.UserResponse, error) {
	stmt := `SELECT u.id, u.name, u.updated_at, u.role_id, r.name as role, u.email 
			 FROM UserAccount u 
			 LEFT JOIN Role r ON u.role_id = r.id 
			 ORDER BY u.name ASC`

	rows, err := r.Db.Query(stmt)
	if err != nil {
		return nil, fmt.Errorf("UserRepo - GetAllUsers - db.Query: %w", err)
	}

	defer rows.Close()

	entities := make([]entity.UserResponse, 0, _defaultEntityCap)

	for rows.Next() {
		var user entity.UserResponse

		err = rows.Scan(&user.ID, &user.Name, &user.UpdatedAt, &user.RoleId, &user.Role, &user.Email)
		if err != nil {
			return nil, fmt.Errorf("UserRepo - GetAllUsers - rows.Scan: %w", err)
		}

		entities = append(entities, user)
	}

	return entities, nil
}

func (r UserRepo) EditUsersRole(id_user string, role_id string) error {
	stmt := `UPDATE UserAccount SET role_id=$2 WHERE id = $1`
	_, err := r.Db.Exec(stmt, id_user, role_id)
	if err != nil {
		// panic(err)
		return fmt.Errorf("UserRepo - EditUsersRole - db.Exec: %w", err)
	}
	return nil
}

func (r UserRepo) GetProfile(token string) (entity.UserResponse, error) {
	stmt := `SELECT u.id, u.name, u.updated_at, u.role_id, r.name as role, u.email 
			 FROM UserAccount u 
			 LEFT JOIN Role r ON u.role_id = r.id 
			 WHERE u.token = $1`

	var user entity.UserResponse
	err := r.Db.QueryRow(stmt, token).Scan(&user.ID, &user.Name, &user.UpdatedAt, &user.RoleId, &user.Role, &user.Email)
	if err != nil {
		return entity.UserResponse{}, fmt.Errorf("UserRepo - GetProfile - db.Query: %w", err)
	}

	return user, nil
}

// SetResetToken updates the reset token and its expiry for a user
func (r UserRepo) SetResetToken(email string, token string, expiry time.Time) error {
	stmt := `UPDATE UserAccount SET reset_token=$2, reset_token_expiry=$3 WHERE email = $1`
	_, err := r.Db.Exec(stmt, email, token, expiry)
	if err != nil {
		return fmt.Errorf("UserRepo - SetResetToken - db.Exec: %w", err)
	}
	return nil
}

// ValidateResetToken checks if the provided reset token is valid and hasn't expired
func (r UserRepo) ValidateResetToken(email string, token string) (bool, error) {
	stmt := `SELECT reset_token, reset_token_expiry FROM UserAccount WHERE email = $1`
	var storedToken string
	var storedExpiry time.Time
	err := r.Db.QueryRow(stmt, email).Scan(&storedToken, &storedExpiry)
	if err != nil {
		return false, fmt.Errorf("UserRepo - ValidateResetToken - db.Query: %w", err)
	}
	if token != storedToken || time.Now().After(storedExpiry) {
		return false, nil
	}
	return true, nil
}

// UpdateUserPassword updates the user's password
func (r UserRepo) UpdateUserPassword(email string, newPassword string) error {
	stmt := `UPDATE UserAccount SET password=$2 WHERE email = $1`
	_, err := r.Db.Exec(stmt, email, newPassword)
	if err != nil {
		return fmt.Errorf("UserRepo - UpdateUserPassword - db.Exec: %w", err)
	}
	return nil
}
