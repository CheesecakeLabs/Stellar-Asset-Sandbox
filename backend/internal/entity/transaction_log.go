package entity

type LogTransaction struct {
	LogID             int    `json:"log_id" example:"1"`
	UserID            int    `json:"user_id" example:"42"`
	TransactionTypeID int    `json:"transaction_type_id" example:"1"`
	Asset             Asset  `json:"asset"`
	AssetCode         string `json:"asset_code" example:"USDC"`
	AssetIssuer       string `json:"AssetIssuer" example:"HJGDS..."`
	Date              string `json:"date" example:"2023-08-10T14:30:00Z"`
	Amount            string `json:"amount" example:"100000"`
	Description       string `json:"description" example:"Mint Asset"`
}

const (
	CreateAsset     int = iota + 1 // CreateAsset = 1
	MintAsset                      // MintAsset = 2
	UpdateAuthFlags                // UpdateAuthFlags = 3
	ClawbackAsset                  // ClawbackAsset = 4
	BurnAsset                      // BurnAsset = 5
	TransferAsset                  // TransferAsset = 6
)
