/* eslint-disable @typescript-eslint/no-explicit-any */
import { Address, I128 } from '../constants'
import { IInvokeSorobanArgs, invokeSoroban } from '../index'
import { Methods, spec } from './constants'

const deposit = async (rawArgs: {
  amount: I128
  address: string
  contractId: string
  signerSecret?: string
}): Promise<any> => {
  const args = {
    address: new Address(rawArgs.address),
    amount: rawArgs.amount,
  }

  let invokeArgs: IInvokeSorobanArgs = {
    contractId: 'contractId',
    spec,
    method: Methods.deposit,
    sourcePk: rawArgs.address,
  }

  invokeArgs = args ? { ...invokeArgs, ...{ args: args as any } } : invokeArgs

  invokeArgs = rawArgs.signerSecret
    ? { ...invokeArgs, ...{ sourceSk: rawArgs.signerSecret } }
    : invokeArgs

  return invokeSoroban(invokeArgs)
}

export const assetControllerClient = {
  deposit,
}
