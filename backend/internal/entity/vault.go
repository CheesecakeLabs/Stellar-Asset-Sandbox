package entity

type Vault struct {
	Id              int            `json:"id" example:"1"`
	Name            string         `json:"name" example:"Treasury"`
	Wallet          Wallet         `json:"wallet"`
	VaultCategoryId *int           `json:"vault_category_id"`
	VaultCategory   *VaultCategory `json:"vault_category"`
	Active          int            `json:"active"`
	OwnerId         *int           `json:"owner_id"`
}
