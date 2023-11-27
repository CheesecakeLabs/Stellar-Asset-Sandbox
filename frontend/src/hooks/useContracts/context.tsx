import { position } from '@chakra-ui/react'
import { SetStateAction, createContext, useCallback, useState } from 'react'

import freighter from '@stellar/freighter-api'
import axios from 'axios'
import { certificateOfDepositClient } from 'soroban/certificate-of-deposit'
import { MessagesError } from 'utils/constants/messages-error'
import { mockContracts } from 'utils/mockups'

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

  const deposit = async (
    amount: bigint,
    address: string,
    updatePosition: void,
    contractId: string,
    sourcePk: string
  ): Promise<boolean> => {
    setIsDepositing(true)
    try {
      await certificateOfDepositClient.deposit({
        amount: amount * BigInt(10000000),
        address: address,
        contractId: contractId,
        sourcePk: sourcePk,
      })
      setIsDepositing(false)
      setDepositConfirmed(true)
      setTimeout(() => setDepositConfirmed(false), 5000)
      updatePosition
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

  const getPosition = async (
    update: React.Dispatch<React.SetStateAction<bigint>>,
    address: string,
    contractId: string
  ): Promise<bigint | undefined> => {
    try {
      const result = await certificateOfDepositClient.getPosition({
        address: address,
        contractId: contractId,
      })
      console.log('position: ' + result)
      return result
    } catch (e) {
      throw new Error('Invalid position')
    }
  }

  const getYield = async (
    update: React.Dispatch<React.SetStateAction<bigint>>,
    address: string,
    contractId: string
  ): Promise<bigint | undefined> => {
    try {
      const result = await certificateOfDepositClient.getEstimatedYield({
        address: address,
        contractId: contractId,
      })
      console.log('yield: ' + result)
      return result
    } catch (e) {
      throw new Error('Invalid yield')
    }
  }

  const getEstimatedPrematureWithdraw = async (
    update: React.Dispatch<React.SetStateAction<bigint>>,
    address: string,
    contractId: string
  ): Promise<bigint | undefined> => {
    try {
      const result = await certificateOfDepositClient.getEstimatedPrematureWithdraw({
        address: address,
        contractId: contractId,
      })
      console.log('estimated premature:' + result)
      return result
    } catch (e) {
      throw new Error('Invalid estimated premature withdraw')
    }
  }

  const getTime = (
    update: React.Dispatch<React.SetStateAction<bigint>>,
    address: string,
    contractId: string
  ): void => {
    certificateOfDepositClient
      .getTimeLeft({
        address: address,
        contractId: contractId,
      })
      .then((res: SetStateAction<bigint>) => {
        update(res)
      })
      .catch(() => {
        setIsDepositing(false)
      })
  }

  const getAccount = (
    update: React.Dispatch<React.SetStateAction<string>>
  ): void => {
    freighter.getPublicKey().then(update)
  }

  const withdraw = async (
    address: string,
    premature: boolean,
    updatePosition: void,
    contractId: string,
    signerSecret?: string
  ): Promise<boolean> => {
    setIsWithdrawing(true)
    try {
      await certificateOfDepositClient.withdraw({
        address: address,
        accept_premature_withdraw: premature,
        contractId: contractId,
        signerSecret: signerSecret,
      })
      setIsWithdrawing(false)
      updatePosition
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
        getTime,
        getAccount,
        withdraw,
        getEstimatedPrematureWithdraw
      }}
    >
      {children}
    </ContractsContext.Provider>
  )
}
