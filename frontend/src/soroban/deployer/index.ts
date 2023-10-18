/* eslint-disable @typescript-eslint/no-explicit-any */
import { IInvokeSorobanArgs, invokeSoroban } from '../index'
import { contractId, Methods, spec } from './constants'

const deploy = async (rawArgs: {
  deployer: string
  wasm_hash: string
  salt: number
  admin: string
  asset: string
  term: string
  compound_step: string
  yield_rate: string
  min_deposit: number
  penalty_rate: string
  signerSecret?: string
}): Promise<any> => {
  const args = {
    deployer: rawArgs.deployer,
    wasm_hash: rawArgs.wasm_hash,
    salt: rawArgs.salt,
    admin: rawArgs.admin,
    asset: rawArgs.asset,
    term: rawArgs.term,
    compound_step: rawArgs.compound_step,
    yield_rate: rawArgs.yield_rate,
    min_deposit: rawArgs.min_deposit,
    penalty_rate: rawArgs.penalty_rate,
  }

  let invokeArgs: IInvokeSorobanArgs = {
    contractId,
    spec,
    method: Methods.deploy,
    sourcePk: rawArgs.deployer,
  }

  invokeArgs = args ? { ...invokeArgs, ...{ args: args as any } } : invokeArgs

  invokeArgs = rawArgs.signerSecret
    ? { ...invokeArgs, ...{ sourceSk: rawArgs.signerSecret } }
    : invokeArgs

  return invokeSoroban(invokeArgs)
}

export const deployerClient = {
  deploy,
}
