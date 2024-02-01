import { createContext, useCallback, useState } from 'react'

import freighter from '@stellar/freighter-api'
import axios from 'axios'
import { useHorizon } from 'hooks/useHorizon'
import { CustomAccountHandler } from 'soroban'
import { STELLAR_NETWORK, WASM_HASH, vcRpcHandler } from 'soroban/constants'
import { BUMP_FEE, ContractsService } from 'soroban/contracts-service'
import { StellarPlus } from 'stellar-plus'
import { ContractEngineErrorCodes } from 'stellar-plus/lib/stellar-plus/core/contract-engine/errors'
import { StellarPlusError } from 'stellar-plus/lib/stellar-plus/error'
import { restoreData } from 'stellar-plus/lib/stellar-plus/error/helpers/soroban-rpc'
import { CertificateOfDepositClient } from 'stellar-plus/lib/stellar-plus/soroban/contracts/certificate-of-deposit'
import {
  FeeBumpTransaction,
  Transaction,
  TransactionXdr,
} from 'stellar-plus/lib/stellar-plus/types'
import { MessagesError } from 'utils/constants/messages-error'

import { http } from 'interfaces/http'

export const ContractsContext = createContext(
  {} as Hooks.UseContractsTypes.IContractsContext
)

interface IProps {
  children: React.ReactNode
}

export const ContractsProvider: React.FC<IProps> = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const [depositConfirmed, setDepositConfirmed] = useState(false)
  const [withdrawConfirmed, setWithdrawConfirmed] = useState(false)
  const [isDepositing, setIsDepositing] = useState(false)
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const { getAccountData } = useHorizon()

  const [contracts, setContracts] = useState<
    Hooks.UseContractsTypes.IContract[] | undefined
  >()

  const createContract = async (
    params: Hooks.UseContractsTypes.IContractRequest
  ): Promise<Hooks.UseContractsTypes.IContract | undefined> => {
    setLoading(true)
    try {
      const response = await http.post(`contract`, params)
      if (response.status === 200) {
        return response.data
      }
      return undefined
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.message)
      }
      throw new Error(MessagesError.errorOccurred)
    } finally {
      setLoading(false)
    }
  }

  const getContracts = useCallback(async (): Promise<
    Hooks.UseContractsTypes.IContract[] | undefined
  > => {
    setLoading(true)
    try {
      const response = await http.get(`contract/list`)
      const data = response.data
      if (data) {
        setContracts(data)
        return data
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.message)
      }
      throw new Error(MessagesError.errorOccurred)
    } finally {
      setLoading(false)
    }
  }, [])

  const getPagedContracts = useCallback(
    async (args: {
      page: number
      limit: number
    }): Promise<Hooks.UseContractsTypes.IPagedContracts | undefined> => {
      setLoading(true)
      try {
        const response = await http.get(
          `contract/list?page=${args.page}&limit=${args.limit}`
        )
        const data = response.data
        if (data) {
          setContracts(data)
          return data
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw new Error(error.message)
        }
        throw new Error(MessagesError.errorOccurred)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const customSign = async (
    tx: Transaction | FeeBumpTransaction,
    publicKey: string
  ): Promise<TransactionXdr> => {
    const signedTransaction = await sign({
      envelope: tx.toXDR(),
      wallet_pk: publicKey,
    })
    return signedTransaction?.envelope || ''
  }

  const getContract = useCallback(
    async (
      id: string
    ): Promise<Hooks.UseContractsTypes.IContract | undefined> => {
      setLoading(true)
      try {
        const response = await http.get(`contract/${id}`)
        const data = response.data
        if (data) {
          if (data.vault) {
            const accountData = await getAccountData(
              data.vault.wallet.key.publicKey
            )
            data.vault.accountData = accountData
          }
          return data
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw new Error(error.message)
        }
        throw new Error(MessagesError.errorOccurred)
      } finally {
        setLoading(false)
      }
    },
    [getAccountData]
  )

  const getContractData = (
    contractId: string,
    sponsorPK: string
  ): CertificateOfDepositClient => {
    const opex = ContractsService.loadAccount(sponsorPK)
    const restoreTxInvocation = ContractsService.getTxInvocation(opex, BUMP_FEE)

    const contract = new StellarPlus.Contracts.CertificateOfDeposit({
      network: STELLAR_NETWORK,
      contractId: contractId,
      rpcHandler: vcRpcHandler,
      wasmHash: WASM_HASH,
      options: {
        restoreTxInvocation: restoreTxInvocation,
      },
    })

    return contract
  }

  const userTxInvocation = (
    sourcePk: string
  ): Hooks.UseContractsTypes.IInvocation => {
    const source = new CustomAccountHandler({
      customSign: customSign,
      publicKey: sourcePk,
    })

    return {
      header: {
        source: sourcePk,
        timeout: 45,
        fee: '1000000',
      },
      signers: [source],
    }
  }

  const deposit = async (
    amount: bigint,
    address: string,
    contractId: string,
    sourcePk: string,
    sponsorPk: string
  ): Promise<boolean> => {
    setIsDepositing(true)
    try {
      const contract = getContractData(contractId, sponsorPk)

      await contract.deposit({
        address: address,
        amount: amount,
        ...userTxInvocation(sourcePk),
      })

      setIsDepositing(false)
      setDepositConfirmed(true)
      setTimeout(() => setDepositConfirmed(false), 5000)
      return true
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.message)
      }
      throw new Error(MessagesError.errorOccurred)
    } finally {
      setIsDepositing(false)
    }
  }

  const restoreData = async (
    sponsorPk: string,
    stellarPlusError: StellarPlusError,
    contract: CertificateOfDepositClient
  ): Promise<void> => {
    const opex = ContractsService.loadAccount(sponsorPk)
    const restoreTxInvocation = ContractsService.getTxInvocation(opex, BUMP_FEE)
    const restoreData = stellarPlusError.meta
      ?.sorobanSimulationData as restoreData

    await contract.restoreFootprint({
      ...restoreTxInvocation,
      restorePreamble: restoreData.restorePreamble,
    })
  }

  const getPosition = async (
    address: string,
    contractId: string,
    sourcePk: string,
    sponsorPk: string
  ): Promise<number | undefined> => {
    const contract = getContractData(contractId, sponsorPk)
    try {
      const result = await contract.getPosition({
        address: address,
        ...userTxInvocation(sourcePk),
      })
      return result
    } catch (e) {
      const stellarPlusError = e as StellarPlusError
      if (stellarPlusError.code === ContractEngineErrorCodes.CE102) {
        restoreData(sponsorPk, stellarPlusError, contract)
      }

      const result = await contract.getPosition({
        address: address,
        ...userTxInvocation(sourcePk),
      })
      return result
    }
  }

  const getYield = async (
    address: string,
    contractId: string,
    sourcePk: string,
    sponsorPk: string
  ): Promise<number | undefined> => {
    const contract = getContractData(contractId, sponsorPk)
    try {
      const result = await contract.getEstimatedYield({
        address: address,
        ...userTxInvocation(sourcePk),
      })
      return result
    } catch (e) {
      const stellarPlusError = e as StellarPlusError
      if (stellarPlusError.code === ContractEngineErrorCodes.CE102) {
        restoreData(sponsorPk, stellarPlusError, contract)
      }

      const result = await contract.getEstimatedYield({
        address: address,
        ...userTxInvocation(sourcePk),
      })
      return result
    }
  }

  const getEstimatedPrematureWithdraw = async (
    address: string,
    contractId: string,
    sourcePk: string,
    sponsorPk: string
  ): Promise<number | undefined> => {
    const contract = getContractData(contractId, sponsorPk)
    try {
      const result = await contract.getEstimatedPrematureWithdraw({
        address: address,
        ...userTxInvocation(sourcePk),
      })
      return result
    } catch (e) {
      const stellarPlusError = e as StellarPlusError
      if (stellarPlusError.code === ContractEngineErrorCodes.CE102) {
        restoreData(sponsorPk, stellarPlusError, contract)
      }

      const result = await contract.getEstimatedPrematureWithdraw({
        address: address,
        ...userTxInvocation(sourcePk),
      })
      return result
    }
  }

  const getTimeLeft = async (
    address: string,
    contractId: string,
    sourcePk: string,
    sponsorPk: string
  ): Promise<number | undefined> => {
    const contract = getContractData(contractId, sponsorPk)
    try {
      const result = await contract.getTimeLeft({
        address: address,
        ...userTxInvocation(sourcePk),
      })
      return result
    } catch (e) {
      const stellarPlusError = e as StellarPlusError
      if (stellarPlusError.code === ContractEngineErrorCodes.CE102) {
        restoreData(sponsorPk, stellarPlusError, contract)
      }

      const result = await contract.getTimeLeft({
        address: address,
        ...userTxInvocation(sourcePk),
      })
      return result
    }
  }

  const getAccount = (
    update: React.Dispatch<React.SetStateAction<string>>
  ): void => {
    freighter.getPublicKey().then(update)
  }

  const withdraw = async (
    address: string,
    accept_premature_withdraw: boolean,
    contractId: string,
    sourcePk: string,
    sponsorPk: string
  ): Promise<boolean> => {
    setIsWithdrawing(true)
    try {
      const contract = getContractData(contractId, sponsorPk)

      await contract.withdraw({
        address: address,
        acceptPrematureWithdraw: accept_premature_withdraw,
        ...userTxInvocation(sourcePk),
      })

      setIsWithdrawing(false)
      setWithdrawConfirmed(true)
      return true
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.message)
      }
      throw new Error(MessagesError.errorOccurred)
    } finally {
      setIsWithdrawing(false)
    }
  }

  const getHistory = useCallback(
    async (
      contractId: number
    ): Promise<Hooks.UseContractsTypes.IHistory[] | undefined> => {
      setLoading(true)
      try {
        const response = await http.get(`contract/history/${contractId}`)
        const data = response.data
        if (data) {
          return data
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw new Error(error.message)
        }
        throw new Error(MessagesError.errorOccurred)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const addContractHistory = async (
    params: Hooks.UseContractsTypes.IHistoryRequest
  ): Promise<Hooks.UseContractsTypes.IHistory | undefined> => {
    setLoading(true)
    try {
      const response = await http.post(`contract/history/`, params)
      if (response.status === 200) {
        return response.data
      }
      return undefined
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.message)
      }
      throw new Error(MessagesError.errorOccurred)
    } finally {
      setLoading(false)
    }
  }

  const updateContractHistory = async (
    params: Hooks.UseContractsTypes.IHistoryUpdate
  ): Promise<Hooks.UseContractsTypes.IHistory | undefined> => {
    setLoading(true)
    try {
      const response = await http.put(`contract/history/`, params)
      if (response.status === 200) {
        return response.data
      }
      return undefined
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.message)
      }
      throw new Error(MessagesError.errorOccurred)
    } finally {
      setLoading(false)
    }
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

  return (
    <ContractsContext.Provider
      value={{
        loading,
        contracts,
        depositConfirmed,
        withdrawConfirmed,
        isDepositing,
        isWithdrawing,
        getContracts,
        createContract,
        getContract,
        deposit,
        getPosition,
        getYield,
        getTimeLeft,
        getAccount,
        withdraw,
        getEstimatedPrematureWithdraw,
        getHistory,
        addContractHistory,
        updateContractHistory,
        getPagedContracts,
        sign,
      }}
    >
      {children}
    </ContractsContext.Provider>
  )
}
