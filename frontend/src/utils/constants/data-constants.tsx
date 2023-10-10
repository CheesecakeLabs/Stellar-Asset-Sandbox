export const typesAsset = [
  { id: 'SECURITY_TOKEN', name: 'Security Token' },
  { id: 'PAYMENT_TOKEN', name: 'Payment Token' },
  { id: 'UTILITY_TOKEN', name: 'Utility Token' },
]

export const assetFlags = [
  {
    name: 'auth_required',
    flag: 'AUTH_REQUIRED_FLAG',
    title: 'Authorize required',
    description:
      'When active, accounts need to be approved by the asset manager before they can hold any balance of this asset. Leaving it disabled makes so that all accounts are free to hold balance and transact this asset by default.',
    isChecked: false,
    isDisabled: false,
  },
  {
    name: 'auth_revocable',
    flag: 'AUTH_REVOCABLE_FLAG',
    title: 'Freeze enabled',
    description:
      'When active, this flag enables the ‘Freeze’ functionality for this asset. It allows for the asset manager to freeze the current balance of a given account holding its asset. The frozen account will then be unable to receive or send the asset in any way until the asset manager unfreezes it.',
    isChecked: false,
    isDisabled: false,
  },
  {
    name: 'auth_clawback',
    flag: 'AUTH_CLAWBACK_ENABLED',
    title: 'Clawback enabled',
    description:
      'When active, this flag enables the ‘Clawback’  functionality for this asset.  It allows for the asset manager to clawback funds from a target account holding balance in its assets. The clawback amount is burned from the circulating supply as result.',
    isChecked: false,
    isDisabled: false,
  },
  {
    name: 'sep_8',
    flag: 'SEP8',
    title: 'SEP 08 - Regulated asset',
    description:
      'Regulated Assets are assets that require an issuer’s approval (or a delegated third party’s approval, such as a licensed securities exchange) on a per-transaction basis. It standardizes the identification of such assets as well as defines the protocol for performing compliance checks and requesting issuer approval. Detailed information can be found in the ',
    isChecked: false,
    isDisabled: true,
    link: 'https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0008.md',
    isComing: true,
  },
]
