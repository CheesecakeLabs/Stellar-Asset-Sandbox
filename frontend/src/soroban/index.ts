import axios from 'axios'
import { Buffer } from 'buffer'
import * as SorobanClient from 'soroban-client'
import {
  ContractSpec,
  SorobanRpc,
  xdr,
  hash,
  TransactionBuilder,
  Server,
  Asset,
  StrKey,
  OperationOptions,
  Operation,
} from 'soroban-client'
import { MessagesError } from 'utils/constants/messages-error'

import { http } from 'interfaces/http'

import { FREIGHTER } from './Freighter'
import { SELECTED_NETWORK } from './StellarHelpers'
import { I128, sorobanConfig } from './constants'

type BuildSorobanTxArgs = {
  contractId: string
  spec: ContractSpec
  method: string
  sourcePk: string
  args?: []
}

export interface IInvokeSorobanArgs extends BuildSorobanTxArgs {
  sourceSk?: string
}

const server = new SorobanClient.Server(sorobanConfig.network.rpc, {
  allowHttp: true,
})

const invokeSoroban = async (
  invokeArgs: IInvokeSorobanArgs
): Promise<
  | SorobanClient.SorobanRpc.GetTransactionResponse
  | SorobanClient.SorobanRpc.GetTransactionStatus
> => {
  const { contractId, spec, method, sourcePk, args } = invokeArgs

  const tx = await buildSorobanTx({
    contractId,
    spec,
    method,
    sourcePk,
    args,
  })

  const signedTx = sourcePk
    ? await sign({
        envelope: tx.toXDR(),
        wallet_pk: sourcePk,
      })
    : new SorobanClient.Transaction(
        await FREIGHTER.signWithFreighter(tx.toXDR(), sourcePk),
        SELECTED_NETWORK.passphrase
      )

  if (signedTx) {
    if (sourcePk) {
      const transaction = new SorobanClient.Transaction(
        (signedTx as Hooks.UseTransactionsTypes.ISignResponse).envelope,
        sorobanConfig.network.passphrase
      )
      return submitSoroban(transaction)
    } else {
      return submitSoroban(
        signedTx as SorobanClient.Transaction | SorobanClient.FeeBumpTransaction
      )
    }
  } else {
    throw new Error('invalid signedTx')
  }
}

const simulatedValue = async (
  invokeArgs: IInvokeSorobanArgs,
  parseResultXdr: (xdr: SorobanClient.xdr.ScVal) => unknown
): Promise<unknown> => {
  const { contractId, spec, method, sourcePk, args } = invokeArgs

  const tx = await buildSorobanTx({
    contractId,
    spec,
    method,
    sourcePk,
    args,
  })

  const transaction = new SorobanClient.Transaction(
    tx.toEnvelope(),
    sorobanConfig.network.passphrase
  )
  const simulated = await server.simulateTransaction(transaction)

  if (SorobanRpc.isSimulationError(simulated)) {
    throw new Error(simulated.error)
  } else if (!simulated.result) {
    throw new Error(`invalid simulation: no result in ${simulated}`)
  }

  return parseResultXdr(simulated.result.retval)
}

const buildSorobanTx = async ({
  contractId,
  spec,
  method,
  sourcePk,
  args = [],
}: BuildSorobanTxArgs): Promise<
  | SorobanClient.Transaction<
      SorobanClient.Memo<SorobanClient.MemoType>,
      SorobanClient.Operation[]
    >
  | SorobanClient.FeeBumpTransaction
> => {
  const server = new SorobanClient.Server(sorobanConfig.network.rpc, {
    allowHttp: true,
  })

  const invokeArgs = spec.funcArgsToScVals(method, args)
  const sourceAccount = await server.getAccount(sourcePk)
  const contract = new SorobanClient.Contract(contractId)

  const transaction = new SorobanClient.TransactionBuilder(sourceAccount, {
    fee: sorobanConfig.fee,
    networkPassphrase: sorobanConfig.network.passphrase,
  })
    .addOperation(contract.call(method, ...invokeArgs))
    .setTimeout(sorobanConfig.txTimeout)
    .build()

  try {
    const preparedTransaction = await server.prepareTransaction(transaction)
    return preparedTransaction
  } catch (e) {
    console.log("Tx couldn't be prepared: ", e)
    throw e
  }
}

const getContractId = (wrapArgs: {
  assetCode: string
  assetIssuerPk: string
}): string => {
  const asset = new Asset(wrapArgs.assetCode, wrapArgs.assetIssuerPk)
  const xdrAsset = asset.toXDRObject()
  const networkId = hash(Buffer.from(SELECTED_NETWORK.passphrase))
  const preimage = xdr.HashIdPreimage.envelopeTypeContractId(
    new xdr.HashIdPreimageContractId({
      networkId: networkId,
      contractIdPreimage:
        xdr.ContractIdPreimage.contractIdPreimageFromAsset(xdrAsset),
    })
  )

  const contractId = StrKey.encodeContract(hash(preimage.toXDR()))

  return contractId
}

const getContractOperation = (wrapArgs: {
  assetCode: string
  assetIssuerPk: string
}): xdr.Operation<Operation.InvokeHostFunction> => {
  const asset = new Asset(wrapArgs.assetCode, wrapArgs.assetIssuerPk)
  const xdrAsset = asset.toXDRObject()

  const createContractArgs = new xdr.CreateContractArgs({
    contractIdPreimage:
      xdr.ContractIdPreimage.contractIdPreimageFromAsset(xdrAsset),
    executable: xdr.ContractExecutable.contractExecutableToken(),
  })

  const func =
    xdr.HostFunction.hostFunctionTypeCreateContract(createContractArgs)
  const options: OperationOptions.InvokeHostFunction = {
    func,
    auth: [],
  }
  const operation = Operation.invokeHostFunction(options)
  return operation
}

const getSourceAccount = (
  publicKey: string
): Promise<SorobanClient.Account> => {
  const rpc = new Server(sorobanConfig.network.rpc, {
    allowHttp: true,
  })
  return rpc.getAccount(publicKey)
}

const wrapClassicAsset = async (
  operation: xdr.Operation<Operation.InvokeHostFunction>,
  sourceAccount: SorobanClient.Account
): Promise<string> => {
  try {
    const transaction = new TransactionBuilder(sourceAccount, {
      fee: sorobanConfig.fee,
      networkPassphrase: sorobanConfig.network.passphrase,
    })
      .addOperation(operation)
      .setTimeout(sorobanConfig.txTimeout)
      .build()

    const preparedTransaction = await server.prepareTransaction(transaction)

    return preparedTransaction.toXDR()
  } catch (e) {
    console.log('Wraping of asset ${wrapArgs.code} failed: ', e)
    throw e
  }
}

const submitSoroban = async (
  signedTx: SorobanClient.Transaction | SorobanClient.FeeBumpTransaction
): Promise<
  | SorobanClient.SorobanRpc.GetTransactionResponse
  | SorobanClient.SorobanRpc.GetTransactionStatus
> => {
  const server = new SorobanClient.Server(sorobanConfig.network.rpc, {
    allowHttp: true,
  })

  try {
    const response: SorobanRpc.SendTransactionResponse =
      await server.sendTransaction(signedTx)

    if (response.status === 'ERROR') {
      console.log('ERROR: Tx failed!: ', response)
      throw new Error('failed transaction!')
    }

    const txHash = response.hash

    let updatedTransaction = await server.getTransaction(txHash)

    const waitUntil = new Date(
      Date.now() + sorobanConfig.txTimeout * 1000
    ).valueOf()

    const waitTime = 1000

    const initial = Date.now()
    while (
      Date.now() < waitUntil &&
      updatedTransaction.status ===
        SorobanClient.SorobanRpc.GetTransactionStatus.NOT_FOUND
    ) {
      await new Promise(resolve => setTimeout(resolve, waitTime))

      updatedTransaction = await server.getTransaction(txHash)
    }

    const final = Date.now()

    console.log('Duration ' + (final - initial))

    return updatedTransaction
  } catch (e) {
    console.log('Error during transaction submission: ')
    console.log(e)
    return SorobanClient.SorobanRpc.GetTransactionStatus.FAILED
  }
}

const sign = async (
  params: Hooks.UseTransactionsTypes.ISignRequest
): Promise<Hooks.UseTransactionsTypes.ISignResponse | undefined> => {
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

export const SorobanService = {
  wrapClassicAsset,
  getContractOperation,
  getContractId,
  getSourceAccount,
  submitSoroban,
  sign,
  invokeSoroban,
  simulatedValue,
}
