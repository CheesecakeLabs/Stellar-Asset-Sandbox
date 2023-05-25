package entity

type Asset struct {
	Id          int    `json:"id" example:"1"`
	Code        string `json:"code" example:"USDC"`
	Distributor Wallet `json:"distributor"`
	Issuer      Wallet `json:"issuer"`
}
