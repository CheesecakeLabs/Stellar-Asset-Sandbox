package entity

type Asset struct {
	Id          int    `json:"id" example:"1"`
	Name        string `json:"name" example:"USD Coin"`
	Code        string `json:"code" example:"USDC"`
	Distributor Wallet `json:"distributor"`
	Issuer      Wallet `json:"issuer"`
	Amount      int    `json:"amount" example:"1000000"`
	AssetType   string `json:"asset_type"`
	Image       []byte `json:"image,omitempty"`
}

const (
	SecurityToken = "security_token"
	StableCoin    = "stable_coin"
	UtilityToken  = "utility_token"
	PaymentToken  = "payment_token"
	DefiToken     = "defi_token"
)
