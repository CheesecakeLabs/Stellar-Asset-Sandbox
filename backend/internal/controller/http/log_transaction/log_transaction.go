package logtransaction

import (
	"fmt"
	"strings"

	"github.com/CheesecakeLabs/token-factory-v2/backend/internal/entity"
)

func CreateLogDescription(transaction int, assetCode, amount string, setFlags, clearFlags []string) string {
	formats := map[int]string{
		entity.CreateAsset:     "Operation: Create Asset | Asset Code: %s",
		entity.MintAsset:       "Operation: Mint | Asset Code: %s",
		entity.BurnAsset:       "Operation: Burn | Asset Code: %s",
		entity.ClawbackAsset:   "Operation: Clawback | Asset Code: %s",
		entity.UpdateAuthFlags: "Operation: Update Auth Flags | Asset Code: %s | Set Flags: %s | Clear Flags: %s",
		entity.TransferAsset:   "Operation: Transfer | Asset Code: %s",
	}

	format, exists := formats[transaction]
	if exists {
		return fmt.Sprintf(format, assetCode, amount, strings.Join(setFlags, ","), strings.Join(clearFlags, ","))
	}

	return "Unrecognized transaction type"
}
