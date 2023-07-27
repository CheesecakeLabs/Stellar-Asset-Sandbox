package entity

type Vault struct {
	Id            int           `json:"id" example:"1"`
	Name          string        `json:"name" example:"Tresury"`
	Wallet        Wallet        `json:"wallet"`
	ValutCategory VaultCategory `json:"vault_category"`
}
