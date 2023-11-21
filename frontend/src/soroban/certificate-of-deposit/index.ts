/* eslint-disable @typescript-eslint/no-explicit-any */
import { Address, I128 } from '../constants'
import { IInvokeSorobanArgs, SorobanService } from '../index'
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
    contractId: rawArgs.contractId,
    spec,
    method: Methods.deposit,
    sourcePk: rawArgs.address,
  }

  invokeArgs = args ? { ...invokeArgs, ...{ args: args as any } } : invokeArgs

  invokeArgs = rawArgs.signerSecret
    ? { ...invokeArgs, ...{ sourceSk: rawArgs.signerSecret } }
    : invokeArgs

  return SorobanService.invokeSoroban(invokeArgs)
}

const withdraw = async (rawArgs: {
  address: string
  accept_premature_withdraw: boolean
  contractId: string
  signerSecret?: string
}): Promise<any> => {
  const args = {
    address: new Address(rawArgs.address),
    accept_premature_withdraw: rawArgs.accept_premature_withdraw,
  }

  let invokeArgs: IInvokeSorobanArgs = {
    contractId: rawArgs.contractId,
    spec,
    method: Methods.withdraw,
    sourcePk: rawArgs.address,
  }

  invokeArgs = args ? { ...invokeArgs, ...{ args: args as any } } : invokeArgs

  invokeArgs = rawArgs.signerSecret
    ? { ...invokeArgs, ...{ sourceSk: rawArgs.signerSecret } }
    : invokeArgs

  return SorobanService.invokeSoroban(invokeArgs)
}

const getEstimatedYield = async (rawArgs: {
  address: string
  contractId: string
  signerSecret?: string
}): Promise<any> => {
  const args = {
    address: new Address(rawArgs.address),
  }

  let invokeArgs: IInvokeSorobanArgs = {
    contractId: rawArgs.contractId,
    spec,
    method: Methods.getEstimatedYield,
    sourcePk: rawArgs.address,
  }

  invokeArgs = args ? { ...invokeArgs, ...{ args: args as any } } : invokeArgs

  invokeArgs = rawArgs.signerSecret
    ? { ...invokeArgs, ...{ sourceSk: rawArgs.signerSecret } }
    : invokeArgs

  return SorobanService.invokeSoroban(invokeArgs)
}

const getPosition = async (rawArgs: {
  address: string
  contractId: string
  signerSecret?: string
}): Promise<any> => {
  const args = {
    address: new Address(rawArgs.address),
  }

  let invokeArgs: IInvokeSorobanArgs = {
    contractId: rawArgs.contractId,
    spec,
    method: Methods.getPosition,
    sourcePk: rawArgs.address,
  }

  invokeArgs = args ? { ...invokeArgs, ...{ args: args as any } } : invokeArgs

  invokeArgs = rawArgs.signerSecret
    ? { ...invokeArgs, ...{ sourceSk: rawArgs.signerSecret } }
    : invokeArgs

  return SorobanService.invokeSoroban(invokeArgs)
}

const getEstimatedPrematureWithdraw = async (rawArgs: {
  address: string
  contractId: string
  signerSecret?: string
}): Promise<any> => {
  const args = {
    address: new Address(rawArgs.address),
  }

  let invokeArgs: IInvokeSorobanArgs = {
    contractId: rawArgs.contractId,
    spec,
    method: Methods.getEstimatedPrematureWithdraw,
    sourcePk: rawArgs.address,
  }

  invokeArgs = args ? { ...invokeArgs, ...{ args: args as any } } : invokeArgs

  invokeArgs = rawArgs.signerSecret
    ? { ...invokeArgs, ...{ sourceSk: rawArgs.signerSecret } }
    : invokeArgs

  return SorobanService.invokeSoroban(invokeArgs)
}

const getTimeLeft = async (rawArgs: {
  address: string
  contractId: string
  signerSecret?: string
}): Promise<any> => {
  const args = {
    address: new Address(rawArgs.address),
  }

  let invokeArgs: IInvokeSorobanArgs = {
    contractId: rawArgs.contractId,
    spec,
    method: Methods.getEstimatedPrematureWithdraw,
    sourcePk: rawArgs.address,
  }

  invokeArgs = args ? { ...invokeArgs, ...{ args: args as any } } : invokeArgs

  invokeArgs = rawArgs.signerSecret
    ? { ...invokeArgs, ...{ sourceSk: rawArgs.signerSecret } }
    : invokeArgs

  return SorobanService.invokeSoroban(invokeArgs)
}

const extendContractValidity = async (rawArgs: {
  address: string
  contractId: string
  signerSecret?: string
}): Promise<any> => {
  let invokeArgs: IInvokeSorobanArgs = {
    contractId: rawArgs.contractId,
    spec,
    method: Methods.getEstimatedPrematureWithdraw,
    sourcePk: rawArgs.address,
  }

  invokeArgs = rawArgs.signerSecret
    ? { ...invokeArgs, ...{ sourceSk: rawArgs.signerSecret } }
    : invokeArgs

  return SorobanService.invokeSoroban(invokeArgs)
}

export const certificateOfDepositClient = {
  deposit,
  withdraw,
  getEstimatedYield,
  getPosition,
  getEstimatedPrematureWithdraw,
  getTimeLeft,
  extendContractValidity,
}
