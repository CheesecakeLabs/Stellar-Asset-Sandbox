package entity

const (
	SponsorType     = "SPONSOR"
	IssuerType      = "ISSUER"
	DistributorType = "DISTRIBUTOR"
)

type Wallet struct {
	Id   int    `json:"id"`
	Type string `json:"type"`
	Key  Key    `json:"key"`
}

type Key struct {
	Id        int    `json:"id"`
	PublicKey string `json:"publicKey"`
	Weight    int    `json:"weight"`
	WalletId  int    `json:"walletId"`
}
