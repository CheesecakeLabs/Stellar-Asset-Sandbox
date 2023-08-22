import { createContext, useCallback, useState } from 'react'

import axios from 'axios'
import { MessagesError } from 'utils/constants/messages-error'

import { http } from 'interfaces/http'

export const DashboardsContext = createContext(
  {} as Hooks.UseDashboardsTypes.IDashboardsContext
)

interface IProps {
  children: React.ReactNode
}

export const DashboardsProvider: React.FC<IProps> = ({ children }) => {
  const [loadingChart, setLoadingChart] = useState(true)

  const getPaymentsByAssetId = useCallback(
    async (
      assetId: string
    ): Promise<Hooks.UseDashboardsTypes.IAsset | undefined> => {
      setLoadingChart(true)
      try {
        const timeRange = '24h'
        const timeFrame = '1'
        const response = await http.get(
          `/log_transactions/assets/${assetId}/sum/${timeRange}/${timeFrame}`
        )
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
        setLoadingChart(false)
      }
    },
    []
  )

  const getPayments = useCallback(async (): Promise<
    Hooks.UseDashboardsTypes.IAsset[] | undefined
  > => {
    setLoadingChart(true)
    try {
      const timeRange = '24h'
      const timeFrame = '1'
      const response = await http.get(
        `/log_transactions/assets/sum/${timeRange}/${timeFrame}`
      )
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
      setLoadingChart(false)
    }
  }, [])

  return (
    <DashboardsContext.Provider
      value={{ loadingChart, getPaymentsByAssetId, getPayments }}
    >
      {children}
    </DashboardsContext.Provider>
  )
}
