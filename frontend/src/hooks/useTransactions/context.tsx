import { createContext, useState } from 'react'

import axios from 'axios'
import { MessagesError } from 'utils/constants/messages-error'

import { http } from 'interfaces/http'

export const TransactionsContext = createContext(
  {} as Hooks.UseTransactionsTypes.ITransactionsContext
)

interface IProps {
  children: React.ReactNode
}

export const TransactionsProvider: React.FC<IProps> = ({ children }) => {
  const [loading, setLoading] = useState(false)

  const submit = async (
    params: Hooks.UseTransactionsTypes.ISubmitRequest
  ): Promise<string | undefined> => {
    setLoading(true)
    try {
      const response = await http.post(`soroban-transactions/submit`, params)
      if (response.status === 200) {
        return response.data.Message.envelope
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

  const getSponsorPK = async (): Promise<string | undefined> => {
    setLoading(true)
    try {
      const response = await http.get(`wallets/sponsor_pk/`)
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
    <TransactionsContext.Provider
      value={{
        loading,
        submit,
        getSponsorPK
      }}
    >
      {children}
    </TransactionsContext.Provider>
  )
}
