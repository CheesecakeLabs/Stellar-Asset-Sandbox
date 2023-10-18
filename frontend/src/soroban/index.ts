import * as SorobanClient from 'soroban-client'
import { ContractSpec, SorobanRpc, xdr, hash } from 'soroban-client'

import { FREIGHTER } from './Freighter'
import { SELECTED_NETWORK } from './StellarHelpers'
import { sorobanConfig } from './constants'

const server = new SorobanClient.Server(sorobanConfig.network.rpc, {
  allowHttp: true,
})

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

  const tx = await buildSorobanTx({
    contractId,
    spec,
    method,
    sourcePk,
    args,
  })

  const signedTx = sourceSk
    ? await signWithSecret(tx, sourceSk)
    : new SorobanClient.Transaction(
        await FREIGHTER.signWithFreighter(tx.toXDR(), sourcePk),
        SELECTED_NETWORK.passphrase
      )

  // const signedTx = await signWithFreighter(tx.toXDR(), sourcePk);

  return submitSorobanTx(signedTx)
}

export const wrapClassicAsset = async (wrapArgs: {
  assetCode: string
  assetIssuerPk: string
}): Promise<
  | SorobanClient.SorobanRpc.GetTransactionResponse
  | SorobanClient.SorobanRpc.GetTransactionStatus
> => {
  const asset = new SorobanClient.Asset(
    wrapArgs.assetCode,
    wrapArgs.assetIssuerPk
  )
  const xdrAsset = asset.toXDRObject()

  const networkId = hash(Buffer.from(SELECTED_NETWORK.passphrase))
  const preimage = xdr.HashIdPreimage.envelopeTypeContractId(
    new xdr.HashIdPreimageContractId({
      networkId: networkId,
      contractIdPreimage:
        xdr.ContractIdPreimage.contractIdPreimageFromAsset(xdrAsset),
    })
  )

  const contractId = SorobanClient.StrKey.encodeContract(hash(preimage.toXDR()))

  console.log(contractId)
  const createContractArgs = new xdr.CreateContractArgs({
    contractIdPreimage:
      xdr.ContractIdPreimage.contractIdPreimageFromAsset(xdrAsset),
    executable: xdr.ContractExecutable.contractExecutableToken(),
  })

  const func =
    SorobanClient.xdr.HostFunction.hostFunctionTypeCreateContract(
      createContractArgs
    )
  const options: SorobanClient.OperationOptions.InvokeHostFunction = {
    func,
    auth: [],
  }
  const operation = SorobanClient.Operation.invokeHostFunction(options)

  const sourceAccount = await server.getAccount(sorobanConfig.admin.pk)

  const transaction = new SorobanClient.TransactionBuilder(sourceAccount, {
    fee: sorobanConfig.fee,
    networkPassphrase: sorobanConfig.network.passphrase,
  })
    .addOperation(operation)
    .setTimeout(sorobanConfig.txTimeout)
    .build()

  try {
    const preparedTransaction = await server.prepareTransaction(transaction)
    const signedTx = await signWithSecret(
      preparedTransaction,
      sorobanConfig.admin.sk
    )

    return await submitSorobanTx(signedTx)
  } catch (e) {
    console.log('Wraping of asset ${wrapArgs.code} failed: ', e)
    throw e
  }
}
