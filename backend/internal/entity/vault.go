package entity

type Vault struct {
	Id            int           `json:"id" example:"1"`
	Name          string        `json:"name" example:"Treasury"`
	Wallet        Wallet        `json:"wallet"`
	VaultCategory VaultCategory `json:"vault_category"`
	Active        int           `json:"active"`
}
