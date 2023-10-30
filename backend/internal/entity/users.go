package entity

type (
	User struct {
		ID               string `json:"id" db:"id"`
		Name             string `json:"name" db:"name"`
		Password         string `json:"password" db:"password"`
		CreatedAt        string `json:"created_at" db:"created_at"`
		UpdatedAt        string `json:"updated_at" db:"updated_at"`
		Token            string `json:"token" db:"token"`
		RoleId           int    `json:"role_id" db:"role_id"`
		Email            string `json:"email" db:"email"`
		ResetToken       string `json:"reset_token" db:"reset_token"`
		ResetTokenExpiry string `json:"reset_token_expiry" db:"reset_token_expiry"`
	}
	UserResponse struct {
		ID        string `json:"id" db:"id"`
		Name      string `json:"name" db:"name"`
		UpdatedAt string `json:"updated_at" db:"updated_at"`
		Role      string `json:"role" db:"role"`
		Email     string `json:"email" db:"email"`
		RoleId    int    `json:"role_id" db:"role_id"`
	}

	UserRole struct {
		ID_user string `json:"id_user"`
		ID_role string `json:"id_role"`
	}
)
