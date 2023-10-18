/* eslint-disable @typescript-eslint/no-explicit-any */
import { sorobanConfig, Address } from '../constants'
import { IInvokeSorobanArgs, invokeSoroban, simulateSorobanTx } from '../index'
import { contractId, metadata, Methods, spec } from './constants'

const invokeRegulatedAsset = async (
  method: Methods,
  options?: { signWithFreighter?: boolean; simulateTx?: boolean },
  args?: any,
  sourcePk?: string,
  sourceSk?: string
): Promise<any> => {
  const txSource = sourcePk ? sourcePk : sorobanConfig.admin.pk

  let invokeArgs: IInvokeSorobanArgs = {
    contractId,
    spec,
    method,
    sourcePk: txSource,
  }

  invokeArgs = args ? { ...invokeArgs, ...{ args: args } } : invokeArgs

  const signerSk = sourceSk ? sourceSk : sorobanConfig.admin.sk

  invokeArgs = options?.signWithFreighter
    ? invokeArgs
    : { ...invokeArgs, ...{ sourceSk: signerSk } }

  return options?.simulateTx
    ? simulateSorobanTx(invokeArgs)
    : invokeSoroban(invokeArgs)
}

const symbol = async (options?: {
  signWithFreighter?: boolean
  simulateTx?: boolean
}): Promise<string> => {
  const result: any = await invokeRegulatedAsset(Methods.symbol, options)

  const output = options?.simulateTx
    ? spec.funcResToNative(Methods.symbol, result.result?.retval)
    : spec.funcResToNative(
        Methods.symbol,
        result.resultMetaXdr.v3().sorobanMeta()?.returnValue().toXDR('base64')
      )

  return output
}

const name = async (options?: {
  signWithFreighter?: boolean
  simulateTx?: boolean
}): Promise<string> => {
  const result: any = await invokeRegulatedAsset(Methods.name, options)

  const output = options?.simulateTx
    ? spec.funcResToNative(Methods.name, result.result?.retval)
    : spec.funcResToNative(
        Methods.name,
        result.resultMetaXdr.v3().sorobanMeta()?.returnValue().toXDR('base64')
      )

  return output
}

const decimals = async (options?: {
  signWithFreighter?: boolean
  simulateTx?: boolean
}): Promise<number> => {
  const result: any = await invokeRegulatedAsset(Methods.decimals, options)

  const output = options?.simulateTx
    ? spec.funcResToNative(Methods.decimals, result.result?.retval)
    : spec.funcResToNative(
        Methods.decimals,
        result.resultMetaXdr.v3().sorobanMeta()?.returnValue().toXDR('base64')
      )

  return output
}

const mint = async (
  rawArgs: { to: string; amount: bigint },
  options?: { signWithFreighter?: boolean; simulateTx?: boolean }
): Promise<any> => {
  const args = {
    to: new Address(rawArgs.to),
    amount: rawArgs.amount,
  }

  const result: any = await invokeRegulatedAsset(Methods.mint, options, args)

  return result.status
}

const transfer = async (
  rawArgs: {
    from: string
    to: string
    amount: bigint
    sourcePk?: string
    sourceSk?: string
  },
  options?: { signWithFreighter?: boolean; simulateTx?: boolean }
): Promise<any> => {
  const args = {
    from: new Address(rawArgs.from),
    to: new Address(rawArgs.to),
    amount: rawArgs.amount,
  }

  const result: any = await invokeRegulatedAsset(
    Methods.transfer,
    options,
    args,
    rawArgs.sourcePk,
    rawArgs.sourceSk
  )

  return result.status
}

const balance = async (
  rawArgs: { id: string },
  options?: { signWithFreighter?: boolean; simulateTx?: boolean }
): Promise<bigint> => {
  const args = {
    id: new Address(rawArgs.id),
  }

  const result: any = await invokeRegulatedAsset(Methods.balance, options, args)

  const output = options?.simulateTx
    ? spec.funcResToNative(Methods.balance, result.result?.retval)
    : spec.funcResToNative(
        Methods.balance,
        result.resultMetaXdr.v3().sorobanMeta()?.returnValue().toXDR('base64')
      )

  return output
}

export const regulatedAssetClient = {
  metadata,
  name,
  symbol,
  decimals,
  mint,
  transfer,
  balance,
}
