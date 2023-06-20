import { createContext, useState } from 'react'

import axios from 'axios'
import { MessagesError } from 'utils/constants/messages-error'

import { http } from 'interfaces/http'

export const AssetsContext = createContext(
  {} as Hooks.UseAssetsTypes.IAssetsContext
)

interface IProps {
  children: React.ReactNode
}

export const AssetsProvider: React.FC<IProps> = ({ children }) => {
  const [loading, setLoading] = useState(false)

  const mint = async (
    params: Hooks.UseAssetsTypes.IMintRequest
  ): Promise<boolean> => {
    setLoading(true)
    try {
      const response = await http.post(`assets/mint`, params)
      return response.status === 200
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.message)
      }
      throw new Error(MessagesError.errorOccurred)
    } finally {
      setLoading(false)
    }
  }

  const burn = async (
    params: Hooks.UseAssetsTypes.IBurnRequest
  ): Promise<boolean> => {
    setLoading(true)
    try {
      const response = await http.post(`assets/burn`, params)
      return response.status === 200
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.message)
      }
      throw new Error(MessagesError.errorOccurred)
    } finally {
      setLoading(false)
    }
  }

  const distribute = async (
    params: Hooks.UseAssetsTypes.IDistributeRequest
  ): Promise<boolean> => {
    setLoading(true)
    try {
      const response = await http.post(`assets/transfer`, params)
      return response.status === 200
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.message)
      }
      throw new Error(MessagesError.errorOccurred)
    } finally {
      setLoading(false)
    }
  }

  const authorize = async (
    params: Hooks.UseAssetsTypes.IAuthorizeRequest
  ): Promise<boolean> => {
    setLoading(true)
    try {
      const response = await http.post(`assets/authorize`, params)
      return response.status === 200
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.message)
      }
      throw new Error(MessagesError.errorOccurred)
    } finally {
      setLoading(false)
    }
  }

  const freeze = async (
    params: Hooks.UseAssetsTypes.IFreezeRequest
  ): Promise<boolean> => {
    setLoading(true)
    try {
      const response = await http.post(`assets/freeze`, params)
      return response.status === 200
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.message)
      }
      throw new Error(MessagesError.errorOccurred)
    } finally {
      setLoading(false)
    }
  }

  const clawback = async (
    params: Hooks.UseAssetsTypes.IClawbackRequest
  ): Promise<boolean> => {
    setLoading(true)
    try {
      const response = await http.post(`assets/clawback`, params)
      return response.status === 200
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
    <AssetsContext.Provider
      value={{
        loading,
        mint,
        burn,
        distribute,
        authorize,
        freeze,
        clawback,
      }}
    >
      {children}
    </AssetsContext.Provider>
  )
}
