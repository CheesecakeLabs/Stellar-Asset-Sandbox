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

func (r RolePermissionRepo) GetUserPermissions(token string) ([]entity.UserPermissionResponse, error) {
	stmt := `SELECT p.name, op.action FROM useraccount ua
			 LEFT JOIN rolepermissionjunction rpj ON ua.role_id = rpj.role_id
			 INNER JOIN permission p ON p.id = rpj.permission_id
			 INNER JOIN operation op ON (p.id = op.permission_id)
			 WHERE ua.token = $1`

	rows, err := r.Db.Query(stmt, token)

	if err != nil {
		return nil, fmt.Errorf("RolePermissionRepo - GetUserPermissions - db.Query: %w", err)
	}

	defer rows.Close()

	entities := make([]entity.UserPermissionResponse, 0, _defaultEntityCap)

	for rows.Next() {
		var rolePermission entity.UserPermissionResponse

		err = rows.Scan(&rolePermission.Name, &rolePermission.Action)
		if err != nil {
			return nil, fmt.Errorf("RolePermissionRepo - GetUserPermissions - rows.Scan: %w", err)
		}

		entities = append(entities, rolePermission)
	}

	return entities, nil
}

func (r RolePermissionRepo) GetRolesPermissions() ([]entity.RolePermissionResponse, error) {
	stmt := `SELECT rp.role_id, rp.permission_id
			FROM rolepermissionjunction rp`

	rows, err := r.Db.Query(stmt)

	if err != nil {
		return nil, fmt.Errorf("RolePermissionRepo - GetRolePermissions - db.Query: %w", err)
	}

	defer rows.Close()

	entities := make([]entity.RolePermissionResponse, 0, _defaultEntityCap)

	for rows.Next() {
		var rolePermission entity.RolePermissionResponse

		err = rows.Scan(&rolePermission.RoleId, &rolePermission.PermissionId)
		if err != nil {
			return nil, fmt.Errorf("RolePermissionRepo - GetRolePermissions - rows.Scan: %w", err)
		}

		entities = append(entities, rolePermission)
	}

	return entities, nil
}

func (r RolePermissionRepo) GetPermissions() ([]entity.Permission, error) {
	stmt := `SELECT id, name, description FROM permission`

	rows, err := r.Db.Query(stmt)

	if err != nil {
		return nil, fmt.Errorf("RolePermissionRepo - GetPermissions - db.Query: %w", err)
	}

	defer rows.Close()

	entities := make([]entity.Permission, 0, _defaultEntityCap)

	for rows.Next() {
		var permission entity.Permission

		err = rows.Scan(&permission.Id, &permission.Name, &permission.Description)
		if err != nil {
			return nil, fmt.Errorf("RolePermissionRepo - GetPermissions - rows.Scan: %w", err)
		}

		entities = append(entities, permission)
	}

	return entities, nil
}

func (r RolePermissionRepo) DeleteRolePermission(data entity.RolePermissionRequest) (entity.RolePermissionRequest, error) {
	stmt := `DELETE FROM rolepermissionjunction WHERE role_id = $1 AND permission_id = $2;`
	_, err := r.Db.Exec(stmt, data.RoleId, data.PermissionId)
	if err != nil {
		return entity.RolePermissionRequest{}, fmt.Errorf("RolePermissionRepo - DeleteRolePermission - db.QueryRow: %w", err)
	}

	return data, nil
}

func (r RolePermissionRepo) CreateRolePermission(data entity.RolePermissionRequest) (entity.RolePermissionRequest, error) {
	stmt := `INSERT INTO rolepermissionjunction (role_id, permission_id) VALUES ($1, $2);`
	_, err := r.Db.Exec(stmt, data.RoleId, data.PermissionId)
	if err != nil {
		return entity.RolePermissionRequest{}, fmt.Errorf("RolePermissionRepo - CreateRolePermission - db.QueryRow: %w", err)
	}

	return data, nil
}
