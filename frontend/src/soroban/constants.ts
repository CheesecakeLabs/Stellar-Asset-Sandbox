import { StellarPlus } from "stellar-plus";

export const STELLAR_NETWORK = StellarPlus.Constants.testnet

export const WASM_HASH =
  '3e74bccc06fba85a5e0f25cb0488754ef4224d1cd44ed1c409e032abc46fe4fd'

export const vcRpcHandler = new StellarPlus.RPC.ValidationCloudRpcHandler(
  STELLAR_NETWORK,
  'R5T1w4Gss5hHDnBpGHip30yzsvcATdLBgQYGvXQIxq8'
)
