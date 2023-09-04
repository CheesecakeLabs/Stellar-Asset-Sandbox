import { Flex } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'

import { useAssets } from 'hooks/useAssets'
import { useDashboards } from 'hooks/useDashboards'
import { useVaults } from 'hooks/useVaults'

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

  const { loadingVaults, getVaults, getVaultCategories } = useVaults()
  const { loadingChart, getPayments } = useDashboards()
  const { loadingAssets, getAssets, assets } = useAssets()

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
    getAssets()
  }, [getAssets])

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
          setChartPeriod={setChartPeriod}
        />
      </Sidebar>
    </Flex>
  )
}
