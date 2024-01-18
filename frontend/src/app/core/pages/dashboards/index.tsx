import { Flex } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'

import { useAssets } from 'hooks/useAssets'
import { useDashboards } from 'hooks/useDashboards'
import { useVaults } from 'hooks/useVaults'
import { GAService } from 'utils/ga'

import { PathRoute } from 'components/enums/path-route'
import { TChartPeriod } from 'components/molecules/chart-period'
import { Sidebar } from 'components/organisms/sidebar'
import { DashboardsTemplate } from 'components/templates/dashboards'

export const Dashboards: React.FC = () => {
  const [vaults, setVaults] = useState<Hooks.UseVaultsTypes.IVault[]>()
  const [vaultCategories, setVaultCategories] =
    useState<Hooks.UseVaultsTypes.IVaultCategory[]>()
  const [paymentsAssets, setPaymentsAssets] =
    useState<Hooks.UseDashboardsTypes.IAsset[]>()
  const [chartPeriod, setChartPeriod] = useState<TChartPeriod>('24h')
  const [lastTransactions, setLastTransactions] =
    useState<Hooks.UseDashboardsTypes.ITransaction[]>()

  const { loadingVaults, getVaults, getVaultCategories } = useVaults()
  const {
    loadingChart,
    loadingLastTransactions,
    getLastTransactions,
    getPayments,
  } = useDashboards()
  const { loadingAssets, getAssets, assets } = useAssets()

  useEffect(() => {
    GAService.GAPageView('Dashboards')
  }, [])

  useEffect(() => {
    getVaults().then(vaults => setVaults(vaults))
  }, [getVaults])

  useEffect(() => {
    getVaultCategories().then(vaultCategories =>
      setVaultCategories(vaultCategories)
    )
  }, [getVaultCategories])

  useEffect(() => {
    getPayments(chartPeriod).then(paymentsAssets =>
      setPaymentsAssets(paymentsAssets)
    )
  }, [chartPeriod, getPayments])

  useEffect(() => {
    getAssets(true)
  }, [getAssets])

  useEffect(() => {
    getLastTransactions(6).then(lastTransactions =>
      setLastTransactions(lastTransactions)
    )
  }, [getLastTransactions])

  return (
    <Flex>
      <Sidebar highlightMenu={PathRoute.DASHBOARDS}>
        <DashboardsTemplate
          loading={loadingVaults}
          loadingChart={loadingChart}
          paymentsAssets={paymentsAssets}
          vaults={vaults}
          vaultCategories={vaultCategories}
          assets={assets}
          loadingAssets={loadingAssets}
          chartPeriod={chartPeriod}
          transactions={lastTransactions}
          loadingLastTransactions={loadingLastTransactions}
          setChartPeriod={setChartPeriod}
        />
      </Sidebar>
    </Flex>
  )
}
