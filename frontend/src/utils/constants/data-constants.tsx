export const typesAsset = [
  { id: 'SECURITY_TOKEN', name: 'Security Token' },
  { id: 'PAYMENT_TOKEN', name: 'Payment Token' },
  { id: 'UTILITY_TOKEN', name: 'Utility Token' },
  { id: 'STABLECOIN', name: 'Stablecoin' },
  { id: 'DEFI_TOKEN_SOROBAN', name: 'DeFi Token (Soroban)' },
]

export const assetFlags = [
  {
    name: 'auth_required',
    flag: 'AUTH_REQUIRED_FLAG',
    title: 'Authorize Required',
    description:
      "When active, accounts need to be approved by the asset manager before they can hold any balance of this asset. Leaving it disabled makes so that all accounts are free to hold balance and transact this asset by default.",
    isChecked: false
  },
  {
    name: 'auth_clawback',
    flag: 'AUTH_CLAWBACK_ENABLED',
    title: 'Clawback enabled',
    description:
      "When active, this flag enables the ‘Clawback’  functionality for this asset.  It allows for the asset manager to clawback funds from a target account holding balance in its assets. The clawback amount is burned from the circulating supply as result.",
    isChecked: false
  },
  {
    name: 'auth_revocable',
    flag: 'AUTH_REVOCABLE_FLAG',
    title: 'Freeze enabled',
    description:
      "When active, this flag enables the ‘Freeze’ functionality for this asset. It allows for the asset manager to freeze the current balance of a given account holding its asset. The frozen account will then be unable to receive or send the asset in any way until the asset manager unfreezes it.",
    isChecked: false
  },
]
