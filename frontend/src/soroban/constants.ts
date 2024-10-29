import { TestNet } from 'stellar-plus/lib/stellar-plus/network'
import { ValidationCloudRpcHandler } from 'stellar-plus/lib/stellar-plus/rpc'

export const STELLAR_NETWORK = TestNet()

export const WASM_HASH =
  '22f2bb6b005d5af00dc24c5434673c4363503f6feab27d35932dc04dd108baa9'

export const vcRpcHandler = new ValidationCloudRpcHandler(
  STELLAR_NETWORK,
  'R5T1w4Gss5hHDnBpGHip30yzsvcATdLBgQYGvXQIxq8'
)
