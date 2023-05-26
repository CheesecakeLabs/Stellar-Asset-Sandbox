package repo

import (
	"database/sql"
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

func (rpr RolePermissionRepo) Validate(action string, roleId int) (entity.RolePermission, error) {
	stmt := `SELECT count(per.id) as IsAuthorized FROM rolepermissionjunction rpj 
	LEFT JOIN permission per ON (rpj.permission_id = per.id) 
	LEFT JOIN operation ope ON (per.id = ope.permission_id) 
	WHERE action = $1 AND role_id = $2;`

	row := rpr.Db.QueryRow(stmt, action, roleId)

	var rolePermission entity.RolePermission
	
	err := row.Scan(&rolePermission.IsAuthorized)

	if err != nil {
		if err == sql.ErrNoRows {
			return entity.RolePermission{}, fmt.Errorf("RolePermissionRepo - ValidateRolePermission - wallet not found")
		}
		return entity.RolePermission{}, fmt.Errorf("RolePermissionRepo - ValidateRolePermission - row.Scan: %w", err)
	}

	return rolePermission, nil
}

