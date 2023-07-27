import { createContext, useCallback, useState } from 'react'

import axios from 'axios'
import { MessagesError } from 'utils/constants/messages-error'

export const HorizonContext = createContext(
  {} as Hooks.UseHorizonTypes.IHorizonContext
)

interface IProps {
  children: React.ReactNode
}

export const HorizonProvider: React.FC<IProps> = ({ children }) => {
  const BASE_URL = 'https://horizon-testnet.stellar.org'

  const [loadingHorizon, setLoadingHorizon] = useState(false)
  const [assetData, setAssetData] = useState<Hooks.UseHorizonTypes.IAsset>()

  const getAssetData = useCallback(
    async (
      assetCode: string,
      assetIssuer: string
    ): Promise<Hooks.UseHorizonTypes.IAsset | undefined> => {
      setLoadingHorizon(true)
      try {
        const response = await axios.get(
          `${BASE_URL}/assets?asset_code=${assetCode}&asset_issuer=${assetIssuer}`
        )
        const data = response.data?._embedded?.records[0]
        setAssetData(data)
        return data
      } catch (error) {
        if (axios.isAxiosError(error) && error?.response?.status === 400) {
          throw new Error(error.message)
        }
        throw new Error(MessagesError.errorOccurred)
      } finally {
        setLoadingHorizon(false)
      }
    },
    []
  )

  return (
    <HorizonContext.Provider
      value={{
        loadingHorizon,
        assetData,
        getAssetData,
      }}
    >
      {children}
    </HorizonContext.Provider>
  )
}
