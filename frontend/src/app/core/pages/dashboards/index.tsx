import { Flex } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'

import { useDashboards } from 'hooks/useDashboards'
import { useVaults } from 'hooks/useVaults'

import { PathRoute } from 'components/enums/path-route'
import { Sidebar } from 'components/organisms/sidebar'
import { DashboardsTemplate } from 'components/templates/dashboards'

export const Dashboards: React.FC = () => {
  const [vaults, setVaults] = useState<Hooks.UseVaultsTypes.IVault[]>()
  const [vaultCategories, setVaultCategories] =
    useState<Hooks.UseVaultsTypes.IVaultCategory[]>()
  const [paymentsAssets, setPaymentsAssets] =
    useState<Hooks.UseDashboardsTypes.IAsset[]>()
  const { loadingVaults, getVaults, getVaultCategories } = useVaults()
  const { loadingChart, getPayments } = useDashboards()

  useEffect(() => {
    getVaults().then(vaults => setVaults(vaults))
  }, [getVaults])

  useEffect(() => {
    getVaultCategories().then(vaultCategories =>
      setVaultCategories(vaultCategories)
    )
  }, [getVaultCategories])

  useEffect(() => {
    getPayments().then(paymentsAssets => setPaymentsAssets(paymentsAssets))
  }, [getPayments])

  return (
    <Flex>
      <Sidebar highlightMenu={PathRoute.DASHBOARDS}>
        <DashboardsTemplate
          loading={loadingVaults}
          loadingChart={loadingChart}
          paymentsAssets={paymentsAssets}
          vaults={vaults}
          vaultCategories={vaultCategories}
        />
      </Sidebar>
    </Flex>
  )
}
