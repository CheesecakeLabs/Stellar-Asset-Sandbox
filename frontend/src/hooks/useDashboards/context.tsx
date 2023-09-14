import { createContext, useCallback, useState } from 'react'

import axios from 'axios'
import { MessagesError } from 'utils/constants/messages-error'

import { TChartPeriod } from 'components/molecules/chart-period'

import { http } from 'interfaces/http'

export const DashboardsContext = createContext(
  {} as Hooks.UseDashboardsTypes.IDashboardsContext
)

interface IProps {
  children: React.ReactNode
}

export const DashboardsProvider: React.FC<IProps> = ({ children }) => {
  const [loadingChart, setLoadingChart] = useState(true)
  const [loadingLastTransactions, setLoadingLastTransactions] = useState(true)

  const getPaymentsByAssetId = useCallback(
    async (
      assetId: string,
      transactionId?: number,
      period?: TChartPeriod
    ): Promise<Hooks.UseDashboardsTypes.IAsset | undefined> => {
      setLoadingChart(true)
      try {
        const timeRange = period || '24h'
        const timeFrame = !period || period === '24h' ? '1h' : '24h'
        const response = await http.get(
          `log_transactions/assets/${assetId}/type/${
            transactionId || 0
          }/sum/${timeRange}/${timeFrame}`
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

  const getPayments = useCallback(
    async (
      period?: TChartPeriod
    ): Promise<Hooks.UseDashboardsTypes.IAsset[] | undefined> => {
      setLoadingChart(true)
      try {
        const timeRange = period || '24h'
        const timeFrame = !period || period === '24h' ? '1h' : '24h'
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
    },
    []
  )

  const getLastTransactions = useCallback(
    async (
      transactionId: number
    ): Promise<Hooks.UseDashboardsTypes.ITransaction[] | undefined> => {
      setLoadingLastTransactions(true)
      try {
        const response = await http.get(
          `/log_transactions/last-transactions/${transactionId}`
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
        setLoadingLastTransactions(false)
      }
    },
    []
  )

  const getSupplyByAssetId = useCallback(
    async (
      assetId: string,
      period?: TChartPeriod
    ): Promise<Hooks.UseDashboardsTypes.ISupply | undefined> => {
      setLoadingChart(true)
      try {
        const timeRange = period || '24h'
        const timeFrame = !period || period === '24h' ? '1h' : '24h'
        const response = await http.get(
          `/log_transactions/supply/${assetId}/sum/${timeRange}/${timeFrame}`
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

  return (
    <DashboardsContext.Provider
      value={{
        loadingChart,
        loadingLastTransactions,
        getPaymentsByAssetId,
        getPayments,
        getLastTransactions,
        getSupplyByAssetId,
      }}
    >
      {children}
    </DashboardsContext.Provider>
  )
}
