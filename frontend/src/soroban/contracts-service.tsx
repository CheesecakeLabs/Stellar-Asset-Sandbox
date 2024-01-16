import { FieldValues } from 'react-hook-form'

import { FeeBumpTransaction, Transaction } from '@stellar/stellar-sdk'
import axios from 'axios'
import { StellarPlus } from 'stellar-plus'
import { CustomAccountHandlerClient } from 'stellar-plus/lib/stellar-plus/account/account-handler/custom'
import { SACHandler } from 'stellar-plus/lib/stellar-plus/asset'
import { TransactionXdr } from 'stellar-plus/lib/stellar-plus/types'
import { MessagesError } from 'utils/constants/messages-error'

import { TSelectCompoundType } from 'components/templates/contracts-create/components/select-compound-type'

import { http } from 'interfaces/http'

import { STELLAR_NETWORK, vcRpcHandler } from './constants'

export const TOKEN_DECIMALS = 10000000
const SECONDS_IN_DAY = 86400
const VALUE_TO_PERCENTAGE = 100
const FEE = '10000000'
const TIMEOUT = 45

interface ICODParams {
  admin: string
  asset: string
  term: bigint
  compoundStep: bigint
  yieldRate: bigint
  minDeposit: bigint
  penaltyRate: bigint
  allowancePeriod: number
}

interface IHeaderTx {
  header: {
    source: string
    fee: string
    timeout: number
  }
  signers: CustomAccountHandlerClient[]
}

const customSign = async (
  tx: Transaction | FeeBumpTransaction,
  publicKey: string
): Promise<TransactionXdr> => {
  const signedTransaction = await sign({
    envelope: tx.toXDR(),
    wallet_pk: publicKey,
  })

  if (!signedTransaction?.envelope) {
    throw new Error('Invalid transaction envelope')
  }

  return signedTransaction.envelope
}

const sign = async (
  params: Hooks.UseContractsTypes.ISignRequest
): Promise<Hooks.UseContractsTypes.ISignResponse | undefined> => {
  try {
    const response = await http.post(`soroban-transactions/sign`, params)
    if (response.status === 200) {
      return response.data.Message
    }
    return undefined
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.message)
    }
    throw new Error(MessagesError.errorOccurred)
  }
}

const loadToken = (asset: Hooks.UseAssetsTypes.IAssetDto): SACHandler => {
  return new StellarPlus.Asset.SACHandler({
    code: asset.code,
    issuerPublicKey: asset.issuer.key.publicKey,
    network: STELLAR_NETWORK,
    rpcHandler: vcRpcHandler
  })
}

const getExpirationLedger = async (): Promise<number> => {
  const sorobanHandler = new StellarPlus.SorobanHandler(STELLAR_NETWORK)
  const latestLedger = await sorobanHandler.server.getLatestLedger()
  return latestLedger.sequence + 200000
}

const loadAccount = (publicKey: string | undefined): CustomAccountHandlerClient => {
  if (!publicKey) {
    throw new Error('Invalid public key!')
  }

  return new StellarPlus.Account.CustomAccountHandler({
    STELLAR_NETWORK,
    customSign: customSign,
    publicKey: publicKey,
  })
}

const getTxInvocation = (account: CustomAccountHandlerClient): IHeaderTx => {
  return {
    header: {
      source: account.getPublicKey(),
      fee: FEE,
      timeout: TIMEOUT,
    },
    signers: [account],
  }
}

const validateParamsCOD = async (
  vault: Hooks.UseVaultsTypes.IVault,
  asset: Hooks.UseAssetsTypes.IAssetDto,
  token: SACHandler,
  data: FieldValues,
  compoundType: TSelectCompoundType,
  compound: number
): Promise<ICODParams> => {
  const assetContractId = asset.contract_id
    ? asset.contract_id
    : token.sorobanTokenHandler.getContractId()

  if (!assetContractId) throw new Error('Invalid asset')
  if (!data.term) throw new Error('Invalid term')
  if (!data.yield_rate) throw new Error('Invalid yield rate')
  if (!data.penalty_rate) throw new Error('Invalid penalty rate')
  if (!data.min_deposit) throw new Error('Invalid minimum deposit')

  const term = BigInt(Number(data.term) * SECONDS_IN_DAY)
  const yieldRate = BigInt(Number(data.yield_rate) * VALUE_TO_PERCENTAGE)
  const penaltyRate = BigInt(Number(data.penalty_rate) * VALUE_TO_PERCENTAGE)
  const minDeposit = BigInt(Number(data.min_deposit) * TOKEN_DECIMALS)
  const allowancePeriod = await getExpirationLedger()
  const compoundStep = BigInt(
    compoundType === 'Compound interest' ? compound : 0
  )

  const codParams = {
    admin: vault.wallet.key.publicKey,
    asset: assetContractId,
    term: term,
    compoundStep: compoundStep,
    yieldRate: yieldRate,
    minDeposit: minDeposit,
    penaltyRate: penaltyRate,
    allowancePeriod: allowancePeriod,
  }

  return codParams
}

export const ContractsService = {
  customSign,
  loadToken,
  validateParamsCOD,
  loadAccount,
  getTxInvocation,
}
