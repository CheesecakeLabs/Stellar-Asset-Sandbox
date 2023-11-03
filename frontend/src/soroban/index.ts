import axios from 'axios'
import { Buffer } from 'buffer'
import * as SorobanClient from 'soroban-client'
import {
  ContractSpec,
  SorobanRpc,
  xdr,
  hash,
  TransactionBuilder,
  assembleTransaction,
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
import { sorobanConfig } from './constants'

type BuildSorobanTxArgs = {
  contractId: string
  spec: ContractSpec
  method: string
  sourcePk: string
  args?: []
}

export const buildSorobanTx = async ({
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

export const simulateSorobanTx = async ({
  contractId,
  spec,
  method,
  sourcePk,
  args = [],
}: BuildSorobanTxArgs): Promise<
  SorobanRpc.SimulateTransactionSuccessResponse | undefined
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

    const simulated: SorobanRpc.SimulateTransactionResponse =
      await server.simulateTransaction(preparedTransaction)

    if (SorobanRpc.isSimulationError(simulated)) {
      console.log('Simulation Failed! ', simulated)
      throw new Error(simulated.error)
    } else if (!simulated.result) {
      console.log('Simulation Failed! ', simulated)
      throw new Error(`invalid simulation: no result in ${simulated}`)
    } else {
      return simulated
    }
  } catch (e) {
    console.log("Tx couldn't be prepared! ", e)
  }
}

export const signWithSecret = async (
  tx: SorobanClient.Transaction | SorobanClient.FeeBumpTransaction,
  secret: string
): Promise<SorobanClient.Transaction | SorobanClient.FeeBumpTransaction> => {
  const signerKeypair = SorobanClient.Keypair.fromSecret(secret)
  tx.sign(signerKeypair)
  return tx
}

export const submitSorobanTx = async (
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

export interface IInvokeSorobanArgs extends BuildSorobanTxArgs {
  sourceSk?: string
}

export const invokeSoroban = async (
  invokeArgs: IInvokeSorobanArgs
): Promise<
  | SorobanClient.SorobanRpc.GetTransactionResponse
  | SorobanClient.SorobanRpc.GetTransactionStatus
> => {
  const { contractId, spec, method, sourcePk, args, sourceSk } = invokeArgs

  console.log({
    contractId,
    spec,
    method,
    sourcePk,
    args,
  })
  const tx = await buildSorobanTx({
    contractId,
    spec,
    method,
    sourcePk,
    args,
  })

  const signedTx = sourceSk
    ? await sign({
        envelope: tx.toXDR(),
        wallet_pk: sourceSk,
      })
    : new SorobanClient.Transaction(
        await FREIGHTER.signWithFreighter(tx.toXDR(), sourcePk),
        SELECTED_NETWORK.passphrase
      )

  // const signedTx = await signWithFreighter(tx.toXDR(), sourcePk);

  if (signedTx) {
    if (sourceSk) {
      return submitSoroban(signedTx as string)
    } else {
      return submitSorobanTx(
        signedTx as SorobanClient.Transaction | SorobanClient.FeeBumpTransaction
      )
    }
  } else {
    throw new Error('invalid signedTx')
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

interface ISimulateResponse {
  transactionData: string
  fee: string
}

const simulate = async (
  operation: xdr.Operation<Operation.InvokeHostFunction>
): Promise<ISimulateResponse> => {
  try {
    const rpc = new Server(sorobanConfig.network.rpc, {
      allowHttp: true,
    })

    const sourceAccount = await getSourceAccount(
      'GA7FLYHBEVVZK6NCR7I3Y352VW4D7UNALTIZF4GDLULHA3P2CH5LM56D'
    )
    const tx = new TransactionBuilder(sourceAccount, {
      fee: sorobanConfig.fee,
      networkPassphrase: sorobanConfig.network.passphrase,
    })
      .addOperation(operation)
      .setTimeout(sorobanConfig.txTimeout)
      .build()

    const simulatedTransaction = await rpc.simulateTransaction(tx)
    const preppedTx = assembleTransaction(
      tx,
      sorobanConfig.network.passphrase,
      simulatedTransaction
    ).build()
    return {
      transactionData: (await getTransactionData(tx.toXDR())) || '',
      fee: preppedTx.fee,
    }
  } catch (e) {
    console.log('Wraping of asset ${wrapArgs.code} failed: ', e)
    throw e
  }
}

const getTransactionData = async (xdr: string): Promise<string | undefined> => {
  try {
    const response = await axios
      .create()
      .post(`https://soroban-testnet.stellar.org`, {
        jsonrpc: '2.0',
        id: 1,
        method: 'simulateTransaction',
        params: [xdr],
      })
    if (response.status === 200) {
      return response.data.result.transactionData
    }
    return undefined
  } catch (error) {
    throw new Error(MessagesError.errorOccurred)
  }
}

const wrapClassicAsset = async (
  operation: xdr.Operation<Operation.InvokeHostFunction>,
  sourceAccount: SorobanClient.Account
): Promise<string> => {
  try {
    const simulated = await simulate(operation)

    const tx = new TransactionBuilder(sourceAccount, {
      fee: simulated.fee,
      networkPassphrase: sorobanConfig.network.passphrase,
    })
      .addOperation(operation)
      .setTimeout(sorobanConfig.txTimeout)
      .setSorobanData(
        new SorobanClient.SorobanDataBuilder(simulated.transactionData).build()
      )
      .build()

    return tx.toXDR()
  } catch (e) {
    console.log('Wraping of asset ${wrapArgs.code} failed: ', e)
    throw e
  }
}

const submitSoroban = async (
  txHash: string
): Promise<
  | SorobanClient.SorobanRpc.GetTransactionResponse
  | SorobanClient.SorobanRpc.GetTransactionStatus
> => {
  const server = new SorobanClient.Server(sorobanConfig.network.rpc, {
    allowHttp: true,
  })

  try {
    console.log(txHash)
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
): Promise<string | undefined> => {
  try {
    const response = await http.post(`soroban-transactions/sign`, params)
    if (response.status === 200) {
      return response.data.Message.envelope
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
}
