package entity

type RolePermission struct {
	IsAuthorized	int `json:"isAuthorized" db:"isAuthorized"`
}
