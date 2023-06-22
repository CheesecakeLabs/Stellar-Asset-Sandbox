package repo

import (
	"errors"
	"fmt"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/CheesecakeLabs/token-factory-v2/backend/pkg/postgres"
)

type UserRepo struct {
	*postgres.Postgres
}

func New(pg *postgres.Postgres) UserRepo {
	return UserRepo{pg}
}

func (r UserRepo) GetUser(name string) (entity.User, error) {
	stmt := fmt.Sprintf(`SELECT ID, Name, Password, role_id FROM UserAccount WHERE name='%s'`, name)

	rows, err := r.Db.Query(stmt)
	if err != nil {
		return entity.User{}, fmt.Errorf("UserRepo - GetUser - db.Query: %w", err)
	}

	defer rows.Close()

	for rows.Next() {
		var user entity.User

		err = rows.Scan(&user.ID, &user.Name, &user.Password, &user.RoleId)
		if err != nil {
			return entity.User{}, fmt.Errorf("UserRepo - GetUser - rows.Scan: %w", err)
		}

		return user, nil
	}

	return entity.User{}, nil
}

func (r UserRepo) CreateUser(user entity.User) error {
	stmt := `INSERT INTO UserAccount (name, password, role_id) VALUES ($1, $2, $3)`
	_, err := r.Db.Exec(stmt, user.Name, user.Password, user.RoleId)
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
	stmt := `SELECT ID, Name, Password, role_id FROM UserAccount WHERE token = $1`
        
        var user entity.User
	err := r.Db.QueryRow(stmt, token).Scan(&user.ID, &user.Name, &user.Password, &user.RoleId)
	if err != nil {
		return entity.User{}, fmt.Errorf("UserRepo - GetUserByToken - db.Query: %w", err)
	}

	return user, nil
}