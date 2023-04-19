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
	stmt := fmt.Sprintf(`SELECT * FROM UserAccount WHERE name='%s'`, name)

	rows, err := r.Db.Query(stmt)
	if err != nil {
		return entity.User{}, fmt.Errorf("UserRepo - GetUser - db.Query: %w", err)
	}

	defer rows.Close()

	for rows.Next() {
		var user entity.User

		err = rows.Scan(&user.Name)
		if err != nil {
			return entity.User{}, fmt.Errorf("UserRepo - GetUser - rows.Scan: %w", err)
		}

		return user, nil
	}

	return entity.User{}, nil
}
