/* eslint-disable @typescript-eslint/no-explicit-any */
import { Buffer } from 'buffer'
import { Address, I128, U32, U64 } from 'soroban/constants'

import { IInvokeSorobanArgs, SorobanService } from '../index'
import { contractId, Methods, spec } from './constants'

const deploy = async (rawArgs: {
  wasm_hash: string
  salt: string
  admin: string
  asset: string
  term: U64
  compound_step: U64
  yield_rate: U64
  min_deposit: I128
  penalty_rate: U64
  allowance_period: U32
  signerSecret?: string
}): Promise<any> => {
  const args = {
    wasm_hash: Buffer.from(rawArgs.wasm_hash, 'hex'),
    salt: Buffer.from(rawArgs.wasm_hash, 'hex'),
    admin: new Address(rawArgs.admin),
    asset: new Address(rawArgs.asset),
    term: rawArgs.term,
    compound_step: rawArgs.compound_step,
    yield_rate: rawArgs.yield_rate,
    min_deposit: rawArgs.min_deposit,
    penalty_rate: rawArgs.penalty_rate,
    allowance_period: rawArgs.allowance_period
  }

  let invokeArgs: IInvokeSorobanArgs = {
    contractId,
    spec,
    method: Methods.deploy,
    sourcePk: rawArgs.admin.toString(),
  }

  invokeArgs = args ? { ...invokeArgs, ...{ args: args as any } } : invokeArgs

  invokeArgs = rawArgs.signerSecret
    ? { ...invokeArgs, ...{ sourcePk: rawArgs.signerSecret } }
    : invokeArgs

  return SorobanService.invokeSoroban(invokeArgs)
}

export const deployerClient = {
  deploy,
}
