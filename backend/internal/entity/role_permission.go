package entity

type (
	RolePermission struct {
		IsAuthorized int `json:"isAuthorized" db:"isAuthorized"`
	}

	RolePermissionResponse struct {
		Name        string `json:"name" example:"Edit"`
		Action string `json:"action" example:"Edit action"`
	}

	RolePermissionRequest struct {
		RoleId int `json:"role_id" example:"1"`
	}
)
