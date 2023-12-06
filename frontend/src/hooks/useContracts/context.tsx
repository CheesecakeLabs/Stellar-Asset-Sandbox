import { createContext, useCallback, useState } from 'react'

import freighter from '@stellar/freighter-api'
import axios from 'axios'
import { useHorizon } from 'hooks/useHorizon'
import { certificateOfDepositClient } from 'soroban/certificate-of-deposit'
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

  const deposit = async (
    amount: bigint,
    address: string,
    contractId: string,
    sourcePk: string
  ): Promise<boolean> => {
    setIsDepositing(true)
    try {
      const result = await certificateOfDepositClient.deposit({
        amount: amount * BigInt(10000000),
        address: address,
        contractId: contractId,
        sourcePk: sourcePk,
      })
      setIsDepositing(false)
      setDepositConfirmed(true)
      setTimeout(() => setDepositConfirmed(false), 5000)
      return result.status === 'SUCCESS'
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.message)
      }
      throw new Error(MessagesError.errorOccurred)
    } finally {
      setIsDepositing(false)
    }
  }

  const getPosition = async (
    address: string,
    contractId: string
  ): Promise<bigint | undefined> => {
    try {
      const result = await certificateOfDepositClient.getPosition({
        address: address,
        contractId: contractId,
      })
      return result
    } catch (e) {
      return
    }
  }

  const getYield = async (
    address: string,
    contractId: string
  ): Promise<bigint | undefined> => {
    try {
      const result = await certificateOfDepositClient.getEstimatedYield({
        address: address,
        contractId: contractId,
      })
      return result
    } catch (e) {
      return
    }
  }

  const getEstimatedPrematureWithdraw = async (
    address: string,
    contractId: string
  ): Promise<bigint | undefined> => {
    try {
      const result =
        await certificateOfDepositClient.getEstimatedPrematureWithdraw({
          address: address,
          contractId: contractId,
        })
      return result
    } catch (e) {
      return
    }
  }

  const getTimeLeft = async (
    address: string,
    contractId: string
  ): Promise<bigint | undefined> => {
    try {
      const result = await certificateOfDepositClient.getTimeLeft({
        address: address,
        contractId: contractId,
      })
      return result
    } catch (e) {
      return
    }
  }

  const getAccount = (
    update: React.Dispatch<React.SetStateAction<string>>
  ): void => {
    freighter.getPublicKey().then(update)
  }

  const withdraw = async (
    address: string,
    premature: boolean,
    contractId: string,
    signerSecret?: string
  ): Promise<boolean> => {
    setIsWithdrawing(true)
    try {
      const result = await certificateOfDepositClient.withdraw({
        address: address,
        accept_premature_withdraw: premature,
        contractId: contractId,
        signerSecret: signerSecret,
      })

      const xdr = result.returnValue?.toXDR('base64')
      if (!xdr) {
        throw new Error('Invalid transaction XDR')
      }

      setIsWithdrawing(false)
      setWithdrawConfirmed(true)
      return result.status === 'SUCCESS'
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
      }}
    >
      {children}
    </ContractsContext.Provider>
  )
}
