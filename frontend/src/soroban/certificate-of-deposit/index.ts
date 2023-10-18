/* eslint-disable @typescript-eslint/no-explicit-any */
import { sorobanConfig, Address, channelAccounts, I128 } from '../constants'
import { IInvokeSorobanArgs, invokeSoroban, simulateSorobanTx } from '../index'
import {
  IAccountQuotaReleaseData,
  contractId,
  metadata,
  Methods,
  spec,
} from './constants'

const invokeCertificateOfDeposit = async (
  method: Methods,
  options?: { signWithFreighter?: boolean; simulateTx?: boolean },
  args?: any,
  channel?: number
): Promise<any> => {
  let invokeArgs: IInvokeSorobanArgs = {
    contractId,
    spec,
    method,
    sourcePk: channel ? channelAccounts[channel].pk : sorobanConfig.admin.pk,
  }

  invokeArgs = args ? { ...invokeArgs, ...{ args: args } } : invokeArgs

  const signerSk = channel
    ? channelAccounts[channel].sk
    : sorobanConfig.admin.sk

  invokeArgs = options?.signWithFreighter
    ? invokeArgs
    : { ...invokeArgs, ...{ sourceSk: signerSk } }

  return options?.simulateTx
    ? simulateSorobanTx(invokeArgs)
    : invokeSoroban(invokeArgs)
}

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
    contractId,
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

const getQuotaReleaseTime = async (
  rawArgs: { id: string },
  options?: { signWithFreighter?: boolean; simulateTx?: boolean },
  channel?: number
): Promise<IAccountQuotaReleaseData> => {
  const args = {
    id: new Address(rawArgs.id),
  }

  const result: any = await invokeCertificateOfDeposit(
    Methods.get_quota_release_time,
    options,
    args,
    channel
  )

  const output = options?.simulateTx
    ? spec.funcResToNative(
        Methods.get_quota_release_time,
        result.result?.retval
      )
    : spec.funcResToNative(
        Methods.get_quota_release_time,
        result.resultMetaXdr.v3().sorobanMeta()?.returnValue().toXDR('base64')
      )

  return output
}

const getAccountProbationPeriod = async (
  rawArgs: { id: string },
  options?: { signWithFreighter?: boolean; simulateTx?: boolean },
  channel?: number
): Promise<bigint> => {
  const args = {
    id: new Address(rawArgs.id),
  }

  const result: any = await invokeCertificateOfDeposit(
    Methods.get_account_probation_period,
    options,
    args,
    channel
  )

  const output = options?.simulateTx
    ? spec.funcResToNative(
        Methods.get_account_probation_period,
        result.result?.retval
      )
    : spec.funcResToNative(
        Methods.get_account_probation_period,
        result.resultMetaXdr.v3().sorobanMeta()?.returnValue().toXDR('base64')
      )

  return output
}

const getProbationPeriod = async (
  options?: { signWithFreighter?: boolean; simulateTx?: boolean },
  channel?: number
): Promise<bigint> => {
  const result: any = await invokeCertificateOfDeposit(
    Methods.get_probation_period,
    options,
    channel
  )

  const output = options?.simulateTx
    ? spec.funcResToNative(Methods.get_probation_period, result.result?.retval)
    : spec.funcResToNative(
        Methods.get_probation_period,
        result.resultMetaXdr.v3().sorobanMeta()?.returnValue().toXDR('base64')
      )

  return output
}

const getQuotaTimeLimit = async (
  options?: { signWithFreighter?: boolean; simulateTx?: boolean },
  channel?: number
): Promise<bigint> => {
  const result: any = await invokeCertificateOfDeposit(
    Methods.get_quota_time_limit,
    options,
    channel
  )

  const output = options?.simulateTx
    ? spec.funcResToNative(Methods.get_quota_time_limit, result.result?.retval)
    : spec.funcResToNative(
        Methods.get_quota_time_limit,
        result.resultMetaXdr.v3().sorobanMeta()?.returnValue().toXDR('base64')
      )

  return output
}

const getInflowLimit = async (
  options?: { signWithFreighter?: boolean; simulateTx?: boolean },
  channel?: number
): Promise<bigint> => {
  const result: any = await invokeCertificateOfDeposit(
    Methods.get_inflow_limit,
    options,
    channel
  )

  const output = options?.simulateTx
    ? spec.funcResToNative(Methods.get_inflow_limit, result.result?.retval)
    : spec.funcResToNative(
        Methods.get_inflow_limit,
        result.resultMetaXdr.v3().sorobanMeta()?.returnValue().toXDR('base64')
      )

  return output
}

const getOutflowLimit = async (
  options?: { signWithFreighter?: boolean; simulateTx?: boolean },
  channel?: number
): Promise<bigint> => {
  const result: any = await invokeCertificateOfDeposit(
    Methods.get_outflow_limit,
    options,
    channel
  )

  const output = options?.simulateTx
    ? spec.funcResToNative(Methods.get_outflow_limit, result.result?.retval)
    : spec.funcResToNative(
        Methods.get_outflow_limit,
        result.resultMetaXdr.v3().sorobanMeta()?.returnValue().toXDR('base64')
      )

  return output
}

const getAsset = async (
  options?: { signWithFreighter?: boolean; simulateTx?: boolean },
  channel?: number
): Promise<string> => {
  const result: any = await invokeCertificateOfDeposit(
    Methods.get_asset,
    options,
    channel
  )

  const output = options?.simulateTx
    ? spec.funcResToNative(Methods.get_asset, result.result?.retval)
    : spec.funcResToNative(
        Methods.get_asset,
        result.resultMetaXdr.v3().sorobanMeta()?.returnValue().toXDR('base64')
      )

  return output.toString()
}

const getAdmin = async (
  options?: { signWithFreighter?: boolean; simulateTx?: boolean },
  channel?: number
): Promise<string> => {
  const result: any = await invokeCertificateOfDeposit(
    Methods.get_admin,
    options,
    channel
  )

  const output = options?.simulateTx
    ? spec.funcResToNative(Methods.get_admin, result.result?.retval)
    : spec.funcResToNative(
        Methods.get_admin,
        result.resultMetaXdr.v3().sorobanMeta()?.returnValue().toXDR('base64')
      )

  return output.toString()
}

export const assetControllerClient = {
  metadata,
  getQuota,
  getQuotaReleaseTime,
  getAccountProbationPeriod,
  getProbationPeriod,
  getQuotaTimeLimit,
  getInflowLimit,
  getOutflowLimit,
  getAsset,
  getAdmin,
}
