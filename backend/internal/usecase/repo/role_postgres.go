package repo

import (
	"fmt"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/CheesecakeLabs/token-factory-v2/backend/pkg/postgres"
)

type RoleRepo struct {
	*postgres.Postgres
}

func NewRoleRepo(pg *postgres.Postgres) RoleRepo {
	return RoleRepo{pg}
}

func (r RoleRepo) GetRoles() ([]entity.Role, error) {
	stmt := `SELECT * FROM Role ORDER BY name ASC`
	rows, err := r.Db.Query(stmt)

	if err != nil {
		return nil, fmt.Errorf("WalletRepo - GetRoles - db.Query: %w", err)
	}

	defer rows.Close()

	entities := make([]entity.Role, 0, _defaultEntityCap)

	for rows.Next() {
		var role entity.Role

		err = rows.Scan(&role.Id, &role.Name)
		if err != nil {
			return nil, fmt.Errorf("RoleRepo - GetRoles - rows.Scan: %w", err)
		}

		entities = append(entities, role)
	}

	return entities, nil
}
