import { createContext, useCallback, useState } from 'react'

import axios from 'axios'
import { useHorizon } from 'hooks/useHorizon'
import { MessagesError } from 'utils/constants/messages-error'

import { http } from 'interfaces/http'

export const VaultsContext = createContext(
  {} as Hooks.UseVaultsTypes.IVaultsContext
)

interface IProps {
  children: React.ReactNode
}

export const VaultsProvider: React.FC<IProps> = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const [vaults, setVaults] = useState<
    Hooks.UseVaultsTypes.IVault[] | undefined
  >()
  const [vault, setVault] = useState<Hooks.UseVaultsTypes.IVault | undefined>()
  const [vaultCategories, setVaultCategories] = useState<
    Hooks.UseVaultsTypes.IVaultCategory[] | undefined
  >()
  const { getAccountData } = useHorizon()

  const getVaults = useCallback(async (): Promise<void> => {
    setLoading(true)
    try {
      const response = await http.get(`vault/list`)
      const data = response.data
      if (data) {
        data.forEach(async (vault: Hooks.UseVaultsTypes.IVault) => {
          const accountData = await getAccountData(vault.wallet.key.publicKey)
          vault.accountData = accountData
        })
        setVaults(data)
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.message)
      }
      throw new Error(MessagesError.errorOccurred)
    } finally {
      setLoading(false)
    }
  }, [getAccountData])

  const getVaultCategories = useCallback(async (): Promise<void> => {
    setLoading(true)
    try {
      const response = await http.get(`vault-category`)
      const data = response.data
      if (data) {
        setVaultCategories(data)
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

  const createVault = async (
    params: Hooks.UseVaultsTypes.IVaultRequest
  ): Promise<Hooks.UseVaultsTypes.IVault | undefined> => {
    setLoading(true)
    try {
      const response = await http.post(`vault`, params)
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

  const createVaultCategory = async (
    params: Hooks.UseVaultsTypes.IVaultCategoryRequest
  ): Promise<Hooks.UseVaultsTypes.IVaultCategory | undefined> => {
    setLoading(true)
    try {
      const response = await http.post(`vault-category`, params)
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

  const getVaultById = useCallback(
    async (id: string): Promise<void> => {
      setVault(undefined)
      setLoading(true)
      try {
        const response = await http.get(`vault/${id}`)
        const data = response.data
        if (data) {
          const accountData = await getAccountData(data.wallet.key.publicKey)
          data.accountData = accountData
          setVault(data)
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

  return (
    <VaultsContext.Provider
      value={{
        loading,
        vaults,
        vaultCategories,
        vault,
        getVaults,
        getVaultCategories,
        createVault,
        createVaultCategory,
        getVaultById,
      }}
    >
      {children}
    </VaultsContext.Provider>
  )
}
