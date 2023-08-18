import { useToast } from '@chakra-ui/react'
import { createContext, useCallback, useState } from 'react'

import axios from 'axios'
import { useHorizon } from 'hooks/useHorizon'
import { getVaultCategoryTheme } from 'utils/colors'
import { MessagesError } from 'utils/constants/messages-error'

import { http } from 'interfaces/http'

export const VaultsContext = createContext(
  {} as Hooks.UseVaultsTypes.IVaultsContext
)

interface IProps {
  children: React.ReactNode
}

export const VaultsProvider: React.FC<IProps> = ({ children }) => {
  const [loadingVault, setLoadingVault] = useState(true)
  const [loadingVaults, setLoadingVaults] = useState(true)
  const [loadingVaultCategories, setLoadingVaultCategories] = useState(true)
  const [creatingVault, setCreatingVault] = useState(false)
  const [creatingVaultCategory, setCreatingVaultCategory] = useState(false)
  const [updatingVault, setUpdatingVault] = useState(false)
  const [updatingVaultAssets, setUpdatingVaultAssets] = useState(false)
  const [deletingVault, setDeletingVault] = useState(false)
  const [vaults, setVaults] = useState()

  const { getAccountData } = useHorizon()
  const toast = useToast()

  const toastError = useCallback(
    (message: string): void => {
      toast({
        title: 'Error!',
        description: message,
        status: 'error',
        duration: 9000,
        isClosable: true,
        position: 'top-right',
      })
    },
    [toast]
  )

  const getVaults = useCallback(async (): Promise<
    Hooks.UseVaultsTypes.IVault[] | undefined
  > => {
    setLoadingVaults(true)
    try {
      const response = await http.get(`vault/list`)
      const data = response.data
      if (data) {
        await Promise.all(
          data.map(async (vault: Hooks.UseVaultsTypes.IVault) => {
            const accountData = await getAccountData(vault.wallet.key.publicKey)
            vault.accountData = accountData
          })
        )
        setVaults(data)
        return data
      }
    } catch (error) {
      toastError(
        axios.isAxiosError(error) ? error.message : MessagesError.errorOccurred
      )
    } finally {
      setLoadingVaults(false)
    }
  }, [getAccountData, toastError])

  const getVaultCategories = useCallback(async (): Promise<
    Hooks.UseVaultsTypes.IVaultCategory[] | undefined
  > => {
    setLoadingVaultCategories(true)
    try {
      const response = await http.get(`vault-category`)
      const data = response.data
      if (data) {
        return data
      }
    } catch (error) {
      toastError(
        axios.isAxiosError(error) ? error.message : MessagesError.errorOccurred
      )
    } finally {
      setLoadingVaultCategories(false)
    }
  }, [toastError])

  const createVault = async (
    params: Hooks.UseVaultsTypes.IVaultRequest
  ): Promise<Hooks.UseVaultsTypes.IVault | undefined> => {
    setCreatingVault(true)
    try {
      const response = await http.post(`vault`, params)
      if (response.status === 200) {
        return response.data
      }
      return undefined
    } catch (error) {
      toastError(
        axios.isAxiosError(error) ? error.message : MessagesError.errorOccurred
      )
    } finally {
      setCreatingVault(false)
    }
  }

  const createVaultCategory = async (
    params: Hooks.UseVaultsTypes.IVaultCategoryRequest
  ): Promise<Hooks.UseVaultsTypes.IVaultCategory | undefined> => {
    setCreatingVaultCategory(true)
    try {
      const categories = await getVaultCategories()
      params.theme = getVaultCategoryTheme(categories)

      const response = await http.post(`vault-category`, params)
      if (response.status === 200) {
        return response.data
      }
      return undefined
    } catch (error) {
      toastError(
        axios.isAxiosError(error) ? error.message : MessagesError.errorOccurred
      )
    } finally {
      setCreatingVaultCategory(false)
    }
  }

  const getVaultById = useCallback(
    async (id: string): Promise<Hooks.UseVaultsTypes.IVault | undefined> => {
      setLoadingVault(true)
      try {
        const response = await http.get(`vault/${id}`)
        const data = response.data
        if (data) {
          const accountData = await getAccountData(data.wallet.key.publicKey)
          data.accountData = accountData
          return data
        }
      } catch (error) {
        toastError(
          axios.isAxiosError(error)
            ? error.message
            : MessagesError.errorOccurred
        )
      } finally {
        setLoadingVault(false)
      }
    },
    [getAccountData, toastError]
  )

  const updateVault = async (
    id: number,
    params: Hooks.UseVaultsTypes.IVaultUpdateParams
  ): Promise<boolean> => {
    setUpdatingVault(true)
    try {
      const response = await http.put(`/vault/vault-category/${id}`, params)
      return response.status === 200
    } catch (error) {
      toastError(
        axios.isAxiosError(error) ? error.message : MessagesError.errorOccurred
      )
    } finally {
      setUpdatingVault(false)
    }
    return false
  }

  const updateVaultAssets = async (
    id: number,
    params: Hooks.UseVaultsTypes.IVaultAssetsUpdateParams[]
  ): Promise<boolean> => {
    setUpdatingVaultAssets(true)
    try {
      const response = await http.put(`/vault/vault-asset/${id}`, params)
      return response.status === 200
    } catch (error) {
      toastError(
        axios.isAxiosError(error) ? error.message : MessagesError.errorOccurred
      )
    } finally {
      setUpdatingVaultAssets(false)
    }
    return false
  }

  const deleteVault = async (id: number): Promise<boolean> => {
    setDeletingVault(true)
    try {
      const response = await http.put(`/vault/vault-delete/${id}`)
      return response.status === 200
    } catch (error) {
      toastError(
        axios.isAxiosError(error) ? error.message : MessagesError.errorOccurred
      )
    } finally {
      setDeletingVault(false)
    }
    return false
  }

  return (
    <VaultsContext.Provider
      value={{
        vaults,
        loadingVault,
        loadingVaults,
        loadingVaultCategories,
        creatingVault,
        creatingVaultCategory,
        updatingVault,
        updatingVaultAssets,
        deletingVault,
        getVaults,
        getVaultCategories,
        createVault,
        createVaultCategory,
        getVaultById,
        updateVault,
        updateVaultAssets,
        deleteVault,
      }}
    >
      {children}
    </VaultsContext.Provider>
  )
}
