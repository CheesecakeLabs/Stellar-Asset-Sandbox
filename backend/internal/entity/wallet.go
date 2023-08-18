package entity

const (
	SponsorType     = "sponsor"
	IssuerType      = "issuer"
	DistributorType = "distributor"
)

type Wallet struct {
	Id     int    `json:"id" example:"1"`
	Type   string `json:"type" example:"sponsor"`
	Key    Key    `json:"key"`
	Funded bool   `json:"funded"`
}

type Key struct {
	Id        int    `json:"id" example:"1"`
	PublicKey string `json:"publicKey" example:"GCK..."`
	Weight    int    `json:"weight" example:"3"`
	WalletId  int    `json:"walletId" example:"1"`
}
