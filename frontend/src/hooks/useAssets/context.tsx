import { createContext, useCallback, useState } from 'react'

import axios from 'axios'
import { useHorizon } from 'hooks/useHorizon'
import { MessagesError } from 'utils/constants/messages-error'

import { BASE_URL, http } from 'interfaces/http'

export const AssetsContext = createContext(
  {} as Hooks.UseAssetsTypes.IAssetsContext
)

interface IProps {
  children: React.ReactNode
}

export const AssetsProvider: React.FC<IProps> = ({ children }) => {
  const [loadingAssets, setLoadingAssets] = useState(true)
  const [loadingAsset, setLoadingAsset] = useState(true)
  const [loadingOperation, setLoadingOperation] = useState(false)
  const [assets, setAssets] = useState<
    Hooks.UseAssetsTypes.IAssetDto[] | undefined
  >()
  const { getAssetData, getAccountData } = useHorizon()

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

  const getAssets = useCallback(
    async (
      connectHorizon?: boolean
    ): Promise<Hooks.UseAssetsTypes.IAssetDto[] | undefined> => {
      setLoadingAssets(true)
      try {
        const response = await http.get(`assets`)
        const data = response.data

        if (data) {
          if (connectHorizon) {
            await Promise.all(
              data.map(async (asset: Hooks.UseAssetsTypes.IAsset) => {
                const assetData = await getAssetData(
                  asset.code,
                  asset.issuer.key.publicKey
                )
                asset.assetData = assetData
              })
            )
          }
          setAssets(data)
          return data
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw new Error(error.message)
        }
        throw new Error(MessagesError.errorOccurred)
      } finally {
        setLoadingAssets(false)
      }
    },
    [getAssetData]
  )

  const getPagedAssets = useCallback(
    async (args: {
      page: number
      limit: number
    }): Promise<Hooks.UseAssetsTypes.IPagedAssets | undefined> => {
      setLoadingAssets(true)
      try {
        const response = await http.get(
          `assets?page=${args.page}&limit=${args.limit}`
        )
        const data = response.data

        if (data.assets) {
          await Promise.all(
            data.assets.map(async (asset: Hooks.UseAssetsTypes.IAsset) => {
              const assetData = await getAssetData(
                asset.code,
                asset.issuer.key.publicKey
              )
              asset.assetData = assetData
            })
          )
          return data
        }
      } catch (error) {
        console.log(error)
        if (axios.isAxiosError(error)) {
          throw new Error(error.message)
        }
        throw new Error(MessagesError.errorOccurred)
      } finally {
        setLoadingAssets(false)
      }
    },
    [getAssetData]
  )

  const getAssetById = useCallback(
    async (id: string): Promise<Hooks.UseAssetsTypes.IAssetDto | undefined> => {
      setLoadingAsset(true)
      try {
        const response = await http.get(`assets/${id}`)
        const asset = response.data as Hooks.UseAssetsTypes.IAssetDto
        if (asset) {
          const assetData = await getAssetData(
            asset.code,
            asset.issuer.key.publicKey
          )

          const distributorAccount = await getAccountData(
            asset.distributor.key.publicKey
          )
          asset.assetData = assetData
          asset.distributorBalance = distributorAccount?.balances.find(
            balance => balance.asset_code === asset.code
          )
          return asset
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw new Error(error.message)
        }
        throw new Error(MessagesError.errorOccurred)
      } finally {
        setLoadingAsset(false)
      }
    },
    [getAccountData, getAssetData]
  )

  const generateToml = async (
    params: Hooks.UseAssetsTypes.ITomlData
  ): Promise<boolean> => {
    setLoadingOperation(true)
    try {
      const response = await http.put(`assets/update-toml`, params)
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

  const retrieveToml = useCallback(async (): Promise<Blob | undefined> => {
    try {
      const response = await axios
        .create({
          baseURL: BASE_URL,
          responseType: 'blob',
        })
        .get(`/.well-known/stellar.toml`)

      if (response.data) {
        const file = new Blob([response.data], { type: 'application/txt' })

        const reader = new FileReader()
        reader.readAsText(file)
        reader.onload = (): void => {
          document.body.innerText = reader.result as string
        }

        return response.data
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.message)
      }
      throw new Error(MessagesError.errorOccurred)
    }
  }, [])

  const getTomlData =
    useCallback(async (): Promise<Hooks.UseAssetsTypes.ITomlFile> => {
      setLoadingAssets(true)
      try {
        const response = await http.get(`assets/toml-data`)
        const data = response.data
        return data
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw new Error(error.message)
        }
        throw new Error(MessagesError.errorOccurred)
      } finally {
        setLoadingAssets(false)
      }
    }, [])

  const updateImage = async (id: number, image: unknown): Promise<boolean> => {
    setLoadingOperation(true)
    try {
      const response = await http.post(`assets/${id}/image`, { image: image })
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

  const updateContractId = async (
    assetId: number,
    contractId: string
  ): Promise<boolean> => {
    try {
      const response = await http.put(`assets/${assetId}/update-contract-id`, {
        contract_id: contractId,
      })
      return response.status === 200
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.message)
      }
      throw new Error(MessagesError.errorOccurred)
    }
  }

  return (
    <AssetsContext.Provider
      value={{
        loadingAssets,
        loadingAsset,
        loadingOperation,
        assets,
        mint,
        burn,
        distribute,
        authorize,
        updateAuthFlags,
        clawback,
        forge,
        getAssets,
        getAssetById,
        generateToml,
        retrieveToml,
        getTomlData,
        updateImage,
        updateContractId,
        getPagedAssets,
      }}
    >
      {children}
    </AssetsContext.Provider>
  )
}
