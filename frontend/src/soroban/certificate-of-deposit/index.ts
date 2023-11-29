/* eslint-disable @typescript-eslint/no-explicit-any */
import * as SorobanClient from 'soroban-client'

import { Address, I128 } from '../constants'
import { IInvokeSorobanArgs, SorobanService } from '../index'
import { Methods, spec } from './constants'

const deposit = async (rawArgs: {
  amount: I128
  address: string
  contractId: string
  sourcePk: string
}): Promise<any> => {
  const args = {
    address: new Address(rawArgs.address),
    amount: rawArgs.amount,
  }

  let invokeArgs: IInvokeSorobanArgs = {
    contractId: rawArgs.contractId,
    spec,
    method: Methods.deposit,
    sourcePk: rawArgs.sourcePk,
  }

  invokeArgs = args ? { ...invokeArgs, ...{ args: args as any } } : invokeArgs

  invokeArgs = rawArgs.sourcePk
    ? { ...invokeArgs, ...{ sourceSk: rawArgs.sourcePk } }
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
  sourcePk?: string
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

  invokeArgs = rawArgs.sourcePk
    ? { ...invokeArgs, ...{ sourceSk: rawArgs.sourcePk } }
    : invokeArgs

  return SorobanService.simulatedValue(
    invokeArgs,
    (xdr: SorobanClient.xdr.ScVal): I128 => {
      return spec.funcResToNative('get_estimated_yield', xdr)
    }
  )
}

const getPosition = async (rawArgs: {
  address: string
  contractId: string
  sourcePk?: string
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

  invokeArgs = rawArgs.sourcePk
    ? { ...invokeArgs, ...{ sourceSk: rawArgs.sourcePk } }
    : invokeArgs

  return SorobanService.simulatedValue(
    invokeArgs,
    (xdr: SorobanClient.xdr.ScVal): I128 => {
      return spec.funcResToNative('get_position', xdr)
    }
  )
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

  return SorobanService.simulatedValue(
    invokeArgs,
    (xdr: SorobanClient.xdr.ScVal): I128 => {
      return spec.funcResToNative('get_estimated_premature_withdraw', xdr)
    }
  )
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
    method: Methods.getTimeLeft,
    sourcePk: rawArgs.address,
  }

  invokeArgs = args ? { ...invokeArgs, ...{ args: args as any } } : invokeArgs

  invokeArgs = rawArgs.signerSecret
    ? { ...invokeArgs, ...{ sourceSk: rawArgs.signerSecret } }
    : invokeArgs

  return SorobanService.simulatedValue(
    invokeArgs,
    (xdr: SorobanClient.xdr.ScVal): I128 => {
      return spec.funcResToNative('get_time_left', xdr)
    }
  )
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
