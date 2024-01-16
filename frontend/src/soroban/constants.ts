import { StellarPlus } from "stellar-plus";

export const STELLAR_NETWORK = StellarPlus.Constants.testnet

export const WASM_HASH =
  '6cc0156febf6f2b83fa46f5b5ec58f516a05e7921dbe4d33398e735e3af203d8'

export const vcRpcHandler = new StellarPlus.RPC.ValidationCloudRpcHandler(
  STELLAR_NETWORK,
  'R5T1w4Gss5hHDnBpGHip30yzsvcATdLBgQYGvXQIxq8'
)
