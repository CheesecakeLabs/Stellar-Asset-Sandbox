package repo

import (
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
	stmt := fmt.Sprintf(`SELECT * FROM "UserAccount" WHERE name='%s'`, name)

	rows, err := r.Db.Query(stmt)
	if err != nil {
		return entity.User{}, fmt.Errorf("UserRepo - GetUser - db.Query: %w", err)
	}

	defer rows.Close()

	for rows.Next() {
		var user entity.User

		err = rows.Scan(&user.Name, &user.Password)
		if err != nil {
			return entity.User{}, fmt.Errorf("UserRepo - GetUser - rows.Scan: %w", err)
		}

		return user, nil
	}

	return entity.User{}, nil
}

func (r UserRepo) CreateUser(user entity.User) error {
	stmt := `INSERT INTO public."UserAccount" (name, password) VALUES ($1, $2)`
	fmt.Println(user)
	_, err := r.Db.Exec(stmt, user.Name, user.Password)
	if err != nil {
		panic(err)
		// return fmt.Errorf("UserRepo - CreateUser - db.Exec: %w", err)
	}
	fmt.Println("User created successfully")
	return nil
}

func (r UserRepo) UpdateToken(id string, token string) error {
	// insert into if not exists if exist replace
	stmt := `INSERT INTO public."UserAccount" (id, token) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET token = $2`
	_, err := r.Db.Exec(stmt, id, token)
	if err != nil {
		// panic(err)
		return fmt.Errorf("UserRepo - CreateUser - db.Exec: %w", err)
	}
	return nil
}

func (r UserRepo) ValidateToken(id string, token string) error {
	stmt := fmt.Sprintf(`SELECT * FROM "UserAccount" WHERE id='%s' AND token='%s'`, id, token)

	rows, err := r.Db.Query(stmt)
	if err != nil {
		return fmt.Errorf("UserRepo - GetUser - db.Query: %w", err)
	}

	defer rows.Close()

	for rows.Next() {
		var user entity.User

		err = rows.Scan(&user.Name, &user.Password)
		if err != nil {
			return fmt.Errorf("UserRepo - GetUser - rows.Scan: %w", err)
		}

		return nil
	}

	return fmt.Errorf("UserRepo - GetUser - db.Query: %w", err)
}
