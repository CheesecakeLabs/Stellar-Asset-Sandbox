package entity

type (
	RolePermission struct {
		IsAuthorized int `json:"isAuthorized" db:"isAuthorized"`
	}

	UserPermissionResponse struct {
		Name   string `json:"name" example:"Edit"`
		Action string `json:"action" example:"Edit action"`
	}

	UserPermissionRequest struct {
		RoleId int `json:"role_id" example:"1"`
	}

	RolePermissionRequest struct {
		Id           int  `json:"id" example:"1"`
		RoleId       int  `json:"role_id" example:"1"`
		PermissionId int  `json:"permission_id" example:"1"`
		IsAdd        bool `json:"is_add" example:"false"`
	}
	RolePermissionResponse struct {
		RoleId       string `json:"role_id" example:"1"`
		PermissionId int    `json:"permission_id" example:"1"`
	}

	Permission struct {
		Id          int    `json:"id" example:"1"`
		Name        string `json:"name" example:"name"`
		Description string `json:"description" example:"description"`
	}
)
