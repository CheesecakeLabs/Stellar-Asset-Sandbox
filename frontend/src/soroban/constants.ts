import { StellarPlus } from "stellar-plus";

export const STELLAR_NETWORK = StellarPlus.Constants.testnet

export const vcRpcHandler = new StellarPlus.RPC.ValidationCloudRpcHandler(
  StellarPlus.Constants.testnet,
  'R5T1w4Gss5hHDnBpGHip30yzsvcATdLBgQYGvXQIxq8'
)

export type I128 = bigint;

export const contractId = 'CA3I2XDUUA32PVJ2DTZAYGYCJAGGEUURAMVBQVYTI3JLH3JM4FEFAIHM'
export const codWasmHash =
  '8bb9084ed73d303e5a454ced59946800c5e07f76c651715644eff6a9aabf163a'
