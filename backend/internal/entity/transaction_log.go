package entity

type LogTransaction struct {
	LogID             int      `json:"log_id" example:"1"`
	UserID            int      `json:"user_id" example:"42"`
	TransactionTypeID int      `json:"transaction_type_id" example:"1"`
	Asset             Asset    `json:"asset"`
	Date              string   `json:"date" example:"2023-08-10T14:30:00Z"`
	Amount            float64  `json:"amount" example:"100000"`
	Description       string   `json:"description" example:"Mint Asset"`
	OriginPK          *string  `json:"origin_pk" example:"GSDC..."`
	DestinationPK     *string  `json:"destination_pk" example:"GSDC..."`
	CurrentSupply     *float64 `json:"current_supply" example:"1000"`
	CurrentMainVault  *float64 `json:"current_main_vault" example:"1000"`
	FeeCharged        *int64   `json:"fee_charged" example:"1000"`
}

type SumLogTransaction struct {
	Asset    Asset     `json:"asset"`
	Amount   []float64 `json:"amount" example:"100000"`
	Date     []string  `json:"date" example:"2023-08-10T14:30:00Z"`
	Quantity []int     `json:"quantity" example:"1"`
}

type SumLogTransactionSupply struct {
	Asset             Asset      `json:"asset"`
	CurrentSupply     []*float64 `json:"current_supply" example:"1000"`
	CurrentyMainVault []*float64 `json:"current_main_vault" example:"1000"`
	Date              []string   `json:"date" example:"2023-08-10T14:30:00Z"`
}

type LogTransactionSupply struct {
	CurrentSupply     []*float64 `json:"current_supply" example:"1000"`
	CurrentyMainVault []*float64 `json:"current_main_vault" example:"1000"`
	Date              []string   `json:"date" example:"2023-08-10T14:30:00Z"`
}

const (
	CreateAsset     int = iota + 1 // CreateAsset = 1
	MintAsset                      // MintAsset = 2
	UpdateAuthFlags                // UpdateAuthFlags = 3
	ClawbackAsset                  // ClawbackAsset = 4
	BurnAsset                      // BurnAsset = 5
	TransferAsset                  // TransferAsset = 6
)
