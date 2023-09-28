package repo

import (
	"database/sql"
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
	stmt := `SELECT id, name, admin FROM Role ORDER BY name ASC`
	rows, err := r.Db.Query(stmt)

	if err != nil {
		return nil, fmt.Errorf("WalletRepo - GetRoles - db.Query: %w", err)
	}

	defer rows.Close()

	entities := make([]entity.Role, 0, _defaultEntityCap)

	for rows.Next() {
		var role entity.Role

		err = rows.Scan(&role.Id, &role.Name, &role.Admin)
		if err != nil {
			return nil, fmt.Errorf("RoleRepo - GetRoles - rows.Scan: %w", err)
		}

		entities = append(entities, role)
	}

	return entities, nil
}

func (r RoleRepo) DeleteRole(data entity.RoleDelete) (entity.RoleDelete, error) {
	stmt := `DELETE FROM rolepermissionjunction WHERE role_id = $1;`
	_, err := r.Db.Exec(stmt, data.Id)
	if err != nil {
		return entity.RoleDelete{}, fmt.Errorf("RoleRepo - DeleteRole - db.QueryRow: %w", err)
	}

	stmt = `UPDATE useraccount SET role_id = $1 WHERE role_id = $2`
	_, err = r.Db.Exec(stmt, data.NewUsersRoleId, data.Id)
	if err != nil {
		return entity.RoleDelete{}, fmt.Errorf("RoleRepo - DeleteRole - db.QueryRow: %w", err)
	}

	stmt = `DELETE FROM role WHERE id = $1;`
	_, err = r.Db.Exec(stmt, data.Id)
	if err != nil {
		return entity.RoleDelete{}, fmt.Errorf("RoleRepo - DeleteRole - db.QueryRow: %w", err)
	}

	return data, nil
}

func (r RoleRepo) CreateRole(data entity.RoleRequest) (entity.RoleRequest, error) {
	stmt := `INSERT INTO role (name) VALUES ($1);`
	_, err := r.Db.Exec(stmt, data.Name)
	if err != nil {
		return entity.RoleRequest{}, fmt.Errorf("RoleRepo - CreateRole - db.QueryRow: %w", err)
	}

	return data, nil
}

func (r RoleRepo) UpdateRole(data entity.Role) (entity.Role, error) {
	stmt := `UPDATE role SET name = $1 WHERE id = $2 RETURNING id;`
	err := r.Db.QueryRow(stmt, data.Name, data.Id).Scan(&data.Id)
	if err != nil {
		if err == sql.ErrNoRows {
			return entity.Role{}, fmt.Errorf("RoleRepo - UpdateRole - Vault not found")
		}
		return entity.Role{}, fmt.Errorf("RoleRepo - UpdateRole - db.QueryRow: %w", err)
	}

	return data, nil
}

func (r RoleRepo) GetRoleById(id int) (entity.Role, error) {
	query := `SELECT id, name FROM role WHERE id = $1`

	row := r.Db.QueryRow(query, id)

	var role entity.Role

	err := row.Scan(&role.Id, &role.Name)
	if err != nil {
		if err == sql.ErrNoRows {
			return entity.Role{}, fmt.Errorf("RoleRepo - GetRoleById - role not found")
		}
		return entity.Role{}, fmt.Errorf("RoleRepo - GetRoleById - row.Scan: %w", err)
	}

	return role, nil
}
