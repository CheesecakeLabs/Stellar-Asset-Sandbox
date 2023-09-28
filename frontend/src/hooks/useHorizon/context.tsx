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
  const [accountData, setAccountData] =
    useState<Hooks.UseHorizonTypes.IAccount>()

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

  const getAccountData = useCallback(
    async (
      wallet: string
    ): Promise<Hooks.UseHorizonTypes.IAccount | undefined> => {
      setLoadingHorizon(true)
      try {
        const response = await axios.get(`${BASE_URL}/accounts/${wallet}`)
        const data = response.data
        setAccountData(data)
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

  const getPaymentsData = useCallback(
    async (
      wallet?: string,
      link?: string
    ): Promise<Hooks.UseHorizonTypes.IPayments | undefined> => {
      setLoadingHorizon(true)
      try {
        const response = await axios.get(
          link ? link : `${BASE_URL}/accounts/${wallet}/payments?order=desc`
        )
        const data = response.data as Hooks.UseHorizonTypes.IPayments
        if (data) {
          data._embedded.records =
            data?._embedded?.records.filter(
              (payment: Hooks.UseHorizonTypes.IPaymentItem) =>
                payment.type === 'payment'
            ) || []

          const resultNext = await axios.get(data._links.next.href)

          data._links.next.results =
            resultNext.data?._embedded?.records.filter(
              (payment: Hooks.UseHorizonTypes.IPaymentItem) =>
                payment.type === 'payment'
            ).length || 0

          return data
        }
        return undefined
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

  const getAssetAccounts = useCallback(
    async (
      assetCode: string,
      assetIssuer: string
    ): Promise<Hooks.UseHorizonTypes.IAssetAccounts[] | undefined> => {
      try {
        const response = await axios.get(
          `${BASE_URL}/accounts/?asset=${assetCode}%3A${assetIssuer}&limit=100`
        )
        const data = response.data
        if (data) {
          return data._embedded.records
        }
        return undefined
      } catch (error) {
        if (axios.isAxiosError(error) && error?.response?.status === 400) {
          throw new Error(error.message)
        }
        throw new Error(MessagesError.errorOccurred)
      }
    },
    []
  )

  return (
    <HorizonContext.Provider
      value={{
        loadingHorizon,
        assetData,
        accountData,
        getAssetData,
        getAccountData,
        getPaymentsData,
        getAssetAccounts,
      }}
    >
      {children}
    </HorizonContext.Provider>
  )
}
