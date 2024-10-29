import { TestNet } from "stellar-plus/lib/stellar-plus/network";
import { ValidationCloudRpcHandler } from "stellar-plus/lib/stellar-plus/rpc";

export const STELLAR_NETWORK = TestNet()

export const WASM_HASH =
  'd4fedb949678a4f34963a6cb56b2081a5e9eb537007cb0ea0ff12fc3c7f09de5'

export const vcRpcHandler = new ValidationCloudRpcHandler(
  STELLAR_NETWORK,
  'R5T1w4Gss5hHDnBpGHip30yzsvcATdLBgQYGvXQIxq8'
)
