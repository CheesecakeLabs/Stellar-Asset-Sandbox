package entity

type User struct {
	ID        string `json:"id" db:"id"`
	Name      string `json:"name" db:"name"`
	Password  string `json:"password" db:"password"`
	CreatedAt string `json:"created_at" db:"created_at"`
	UpdatedAt string `json:"updated_at" db:"updated_at"`
	TokenHash string `json:"token_hash" db:"token_hash"`
}
