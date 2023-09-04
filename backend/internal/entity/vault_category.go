package entity

type VaultCategory struct {
	Id    int     `json:"id" example:"1"`
	Name  string  `json:"name" example:"Treasury"`
	Theme *string `json:"theme" example:"blue"`
}
