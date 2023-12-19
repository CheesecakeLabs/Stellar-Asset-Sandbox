package entity

type ContractHistory struct {
	Id             int      `json:"id" example:"1"`
	Contract       Contract `json:"contract"`
	DepositedAt    *string  `json:"deposited_at"`
	DepositAmount  float64  `json:"deposit_amount"`
	WithdrawnAt    *string  `json:"withdrawn_at"`
	WithdrawAmount *float64 `json:"withdraw_amount"`
	User           User     `json:"user"`
}
