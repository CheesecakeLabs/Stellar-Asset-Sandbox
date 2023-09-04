import { SetStateAction, createContext, useCallback, useState } from 'react'

import freighter from '@stellar/freighter-api'
import axios from 'axios'
import { MessagesError } from 'utils/constants/messages-error'
import { mockContracts } from 'utils/mockups'

import * as certificatesOfDeposit from '../../soroban'

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
  const [contract, setContract] = useState<
    Hooks.UseContractsTypes.IContract | undefined
  >()

  const createContract = async (): Promise<
    Hooks.UseContractsTypes.IContract | undefined
  > => {
    setLoading(true)
    try {
      return mockContracts[0]
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.message)
      }
      throw new Error(MessagesError.errorOccurred)
    } finally {
      setLoading(false)
    }
  }

  const getContracts = useCallback(async (): Promise<void> => {
    setLoading(true)
    try {
      setContracts(mockContracts)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.message)
      }
      throw new Error(MessagesError.errorOccurred)
    } finally {
      setLoading(false)
    }
  }, [])

  const getContract = useCallback(async (): Promise<void> => {
    setLoading(true)
    try {
      setContract(mockContracts[0])
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.message)
      }
      throw new Error(MessagesError.errorOccurred)
    } finally {
      setLoading(false)
    }
  }, [])

  const deposit = async (
    amount: bigint,
    address: string,
    updatePosition: void
  ): Promise<boolean> => {
    setIsDepositing(true)
    try {
      await certificatesOfDeposit.deposit(
        {
          amount: amount,
          address: address,
        },
        {
          fee: 10000,
          secondsToWait: 300,
        }
      )
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

  const getPosition = (
    update: React.Dispatch<React.SetStateAction<bigint>>,
    address: string
  ): void => {
    certificatesOfDeposit
      .getPosition({
        address: address,
      })
      .then((res: SetStateAction<bigint>) => {
        update(res)
      })
      .catch(() => {
        setIsDepositing(false)
      })
  }

  const getYield = (
    update: React.Dispatch<React.SetStateAction<bigint>>,
    address: string
  ): void => {
    certificatesOfDeposit
      .getEstimatedYield({
        address: address,
      })
      .then((res: SetStateAction<bigint>) => {
        update(res)
      })
      .catch(() => {
        setIsDepositing(false)
      })
  }

  const getTime = (
    update: React.Dispatch<React.SetStateAction<bigint>>,
    address: string
  ): void => {
    certificatesOfDeposit
      .getTimeLeft({
        address: address,
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
    updatePosition: void
  ): Promise<boolean> => {
    setIsWithdrawing(true)
    try {
      await certificatesOfDeposit.withdraw({
        address: address,
        accept_premature_withdraw: premature,
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
        contract,
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
      }}
    >
      {children}
    </ContractsContext.Provider>
  )
}
