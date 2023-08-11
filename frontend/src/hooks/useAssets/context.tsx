import { createContext, useCallback, useState } from 'react'

import axios from 'axios'
import { useHorizon } from 'hooks/useHorizon'
import { MessagesError } from 'utils/constants/messages-error'

import { http } from 'interfaces/http'

export const AssetsContext = createContext(
  {} as Hooks.UseAssetsTypes.IAssetsContext
)

interface IProps {
  children: React.ReactNode
}

export const AssetsProvider: React.FC<IProps> = ({ children }) => {
  const [loadingAssets, setLoadingAssets] = useState(true)
  const [loadingOperation, setLoadingOperation] = useState(false)
  const [assets, setAssets] = useState<
    Hooks.UseAssetsTypes.IAssetDto[] | undefined
  >()
  const { getAssetData } = useHorizon()

  const forge = async (
    params: Hooks.UseAssetsTypes.IAssetRequest
  ): Promise<Hooks.UseAssetsTypes.IAsset | undefined> => {
    setLoadingOperation(true)
    try {
      const response = await http.post(`assets`, params)
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
      setLoadingOperation(false)
    }
  }

  const mint = async (
    params: Hooks.UseAssetsTypes.IMintRequest
  ): Promise<boolean> => {
    setLoadingOperation(true)
    try {
      const response = await http.post(`assets/mint`, params)
      return response.status === 200
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.message)
      }
      throw new Error(MessagesError.errorOccurred)
    } finally {
      setLoadingOperation(false)
    }
  }

  const burn = async (
    params: Hooks.UseAssetsTypes.IBurnRequest
  ): Promise<boolean> => {
    setLoadingOperation(true)
    try {
      const response = await http.post(`assets/burn`, params)
      return response.status === 200
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.message)
      }
      throw new Error(MessagesError.errorOccurred)
    } finally {
      setLoadingOperation(false)
    }
  }

  const distribute = async (
    params: Hooks.UseAssetsTypes.IDistributeRequest
  ): Promise<boolean> => {
    setLoadingOperation(true)
    try {
      const response = await http.post(`assets/transfer`, params)
      return response.status === 200
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.message)
      }
      throw new Error(MessagesError.errorOccurred)
    } finally {
      setLoadingOperation(false)
    }
  }

  const authorize = async (
    params: Hooks.UseAssetsTypes.IAuthorizeRequest
  ): Promise<boolean> => {
    setLoadingOperation(true)
    try {
      const response = await http.post(`assets/update-auth-flags`, params)
      return response.status === 200
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.message)
      }
      throw new Error(MessagesError.errorOccurred)
    } finally {
      setLoadingOperation(false)
    }
  }

  const updateAuthFlags = async (
    params: Hooks.UseAssetsTypes.IUpdateAuthFlagsRequest
  ): Promise<boolean> => {
    setLoadingOperation(true)
    try {
      const response = await http.post(`assets/update-auth-flags`, params)
      return response.status === 200
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.message)
      }
      throw new Error(MessagesError.errorOccurred)
    } finally {
      setLoadingOperation(false)
    }
  }

  const clawback = async (
    params: Hooks.UseAssetsTypes.IClawbackRequest
  ): Promise<boolean> => {
    setLoadingOperation(true)
    try {
      const response = await http.post(`assets/clawback`, params)
      return response.status === 200
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.message)
      }
      throw new Error(MessagesError.errorOccurred)
    } finally {
      setLoadingOperation(false)
    }
  }

  const getAssets = useCallback(async (): Promise<void> => {
    setLoadingAssets(true)
    try {
      const response = await http.get(`assets`)
      const data = response.data
      if (data) {
        await Promise.all(
          data.map(async (asset: Hooks.UseAssetsTypes.IAsset) => {
            const assetData = await getAssetData(
              asset.code,
              asset.issuer.key.publicKey
            )
            asset.assetData = assetData
          })
        )
        setAssets(data)
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.message)
      }
      throw new Error(MessagesError.errorOccurred)
    } finally {
      setLoadingAssets(false)
    }
  }, [getAssetData])

  return (
    <AssetsContext.Provider
      value={{
        loadingAssets,
        loadingOperation,
        mint,
        burn,
        distribute,
        authorize,
        updateAuthFlags,
        clawback,
        forge,
        getAssets,
        assets,
      }}
    >
      {children}
    </AssetsContext.Provider>
  )
}
