package entity

type Contract struct {
	Id          int    `json:"id" example:"1"`
	Name        string `json:"name" example:"Smart Contract"`
	Address     string `json:"address"`
	Asset       Asset  `json:"asset"`
	Vault       Vault  `json:"vault"`
	YieldRate   int    `json:"yield_rate"`
	Term        int    `json:"term"`
	MinDeposit  int    `json:"min_deposit" db:"min_deposit"`
	PenaltyRate int    `json:"penalty_rate" db:"penalty_rate"`
	CreatedAt   string `json:"created_at" db:"created_at"`
	Compound    int    `json:"compound" db:"compound"`
}
