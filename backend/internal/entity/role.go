package entity

type Role struct {
	Id        int    `json:"id" example:"1"`
	Name      string `json:"name" example:"Admin"`
	Admin     int    `json:"admin" example:"1"`
	CreatedBy int    `json:"created_by" example:"1"`
}

type RoleRequest struct {
	Name      string `json:"name" example:"Admin"`
	CreatedBy int    `json:"created_by" example:"1"`
}

type RoleDelete struct {
	Id             int `json:"id" example:"1"`
	NewUsersRoleId int `json:"new_users_role_id" example:"1"`
}

type RoleDeleteRequest struct {
	NewUsersRoleId int `json:"new_users_role_id" example:"1"`
}
