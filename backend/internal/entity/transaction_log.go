package entity

type TransactionLog struct {
	LogID             int    `json:"log_id" example:"1"`
	UserID            int    `json:"user_id" example:"42"`
	TransactionTypeID int    `json:"transaction_type_id" example:"2"`
	AssetID           int    `json:"asset_id" example:"1001"`
	Date              string `json:"date" example:"2023-08-10T14:30:00Z"`
	Description       string `json:"description" example:"Mint Asset"`
}

const (
	CreateAsset = "Create Asset"
	MintAsset   = "Mint Asset"
	UpdateAuth  = "Update Auth Flags"
	Clawback    = "Clawback Asset"
	BurnAsset   = "Burn Asset"
	Transfer    = "Transfer Asset"
)
