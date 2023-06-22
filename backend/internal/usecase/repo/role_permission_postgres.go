package repo

import (
	"fmt"

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
			WHERE action = $1 AND role_id = $2
		)
	`
        
	var hasPermission bool
	err := rpr.Db.QueryRow(stmt, action, roleId).Scan(&hasPermission)
	if err != nil {
		return false, fmt.Errorf("RolePermissionRepo - ValidateRolePermission - row.Scan: %w", err)
	}
	return hasPermission, nil
}

