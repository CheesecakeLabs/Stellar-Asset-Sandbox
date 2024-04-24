import { StellarPlus } from 'stellar-plus'
import { IS_PUBLIC_NETWORK } from 'utils/constants/stellar'

export const STELLAR_NETWORK = IS_PUBLIC_NETWORK
  ? StellarPlus.Constants.mainnet
  : StellarPlus.Constants.testnet

export const WASM_HASH =
  'd4fedb949678a4f34963a6cb56b2081a5e9eb537007cb0ea0ff12fc3c7f09de5'

export const vcRpcHandler = new StellarPlus.RPC.ValidationCloudRpcHandler(
  STELLAR_NETWORK,
  'R5T1w4Gss5hHDnBpGHip30yzsvcATdLBgQYGvXQIxq8'
)
