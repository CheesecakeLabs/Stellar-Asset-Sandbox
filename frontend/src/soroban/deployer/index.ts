/* eslint-disable @typescript-eslint/no-explicit-any */
import { Buffer } from 'buffer'
import { Address, I128, U64 } from 'soroban/constants'

import { IInvokeSorobanArgs, invokeSoroban } from '../index'
import { contractId, Methods, spec } from './constants'

const deploy = async (rawArgs: {
  deployer: string
  wasm_hash: string
  salt: string
  admin: string
  asset: string
  term: U64
  compound_step: U64
  yield_rate: U64
  min_deposit: I128
  penalty_rate: U64
  signerSecret?: string
}): Promise<any> => {
  const args = {
    deployer: new Address(rawArgs.deployer),
    wasm_hash: Buffer.from(rawArgs.wasm_hash, 'hex'),
    salt: Buffer.from(rawArgs.wasm_hash, 'hex'),
    admin: new Address(rawArgs.admin),
    asset: new Address(rawArgs.asset),
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
    sourcePk: rawArgs.deployer.toString(),
  }

  invokeArgs = args ? { ...invokeArgs, ...{ args: args as any } } : invokeArgs

  invokeArgs = rawArgs.signerSecret
    ? { ...invokeArgs, ...{ sourcePk: rawArgs.signerSecret } }
    : invokeArgs

  return invokeSoroban(invokeArgs)
}

export const deployerClient = {
  deploy,
}
