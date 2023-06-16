package repo

import (
	"fmt"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
	"github.com/CheesecakeLabs/token-factory-v2/backend/pkg/postgres"
)

type RolePermissionRepo struct {
	*postgres.Postgres
}

func NewRolePermissionRepo(pg *postgres.Postgres) RolePermissionRepo {
	return RolePermissionRepo{pg}
}

func (rpr RolePermissionRepo) Validate(action string, roleId int) (bool, error) {
	stmt := `
		SELECT EXISTS(
			SELECT per.id FROM rolepermissionjunction rpj 
			LEFT JOIN permission per ON (rpj.permission_id = per.id) 
			LEFT JOIN operation ope ON (per.id = ope.permission_id) 
			WHERE per.name = $1 AND role_id = $2
		)
	`

	var hasPermission bool
	err := rpr.Db.QueryRow(stmt, action, roleId).Scan(&hasPermission)
	if err != nil {
		return false, fmt.Errorf("RolePermissionRepo - ValidateRolePermission - row.Scan: %w", err)
	}
	return hasPermission, nil
}

func (r RolePermissionRepo) GetRolePermissions(token string) ([]entity.RolePermissionResponse, error) {
	stmt := `SELECT p.name, p.description FROM useraccount ua
			 LEFT JOIN rolepermissionjunction rpj ON ua.role_id = rpj.role_id
			 INNER JOIN permission p ON p.id = rpj.permission_id
			 WHERE ua.token = $1`

	rows, err := r.Db.Query(stmt, token)

	if err != nil {
		return nil, fmt.Errorf("UserRepo - GetRolePermissions - db.Query: %w", err)
	}

	defer rows.Close()

	entities := make([]entity.RolePermissionResponse, 0, _defaultEntityCap)

	for rows.Next() {
		var rolePermission entity.RolePermissionResponse

		err = rows.Scan(&rolePermission.Name, &rolePermission.Description)
		if err != nil {
			return nil, fmt.Errorf("UserRepo - GetRolePermissions - rows.Scan: %w", err)
		}

		entities = append(entities, rolePermission)
	}

	return entities, nil
}
