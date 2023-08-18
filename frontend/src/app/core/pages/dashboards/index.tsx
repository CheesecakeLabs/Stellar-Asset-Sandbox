import { Flex } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'

import { useVaults } from 'hooks/useVaults'

import { PathRoute } from 'components/enums/path-route'
import { Sidebar } from 'components/organisms/sidebar'
import { DashboardsTemplate } from 'components/templates/dashboards'

export const Dashboards: React.FC = () => {
  const [vaults, setVaults] = useState<Hooks.UseVaultsTypes.IVault[]>()
  const [vaultCategories, setVaultCategories] =
    useState<Hooks.UseVaultsTypes.IVaultCategory[]>()
  const { loadingVaults, getVaults, getVaultCategories } = useVaults()

  useEffect(() => {
    getVaults().then(vaults => setVaults(vaults))
  }, [getVaults])

  useEffect(() => {
    getVaultCategories().then(vaultCategories =>
      setVaultCategories(vaultCategories)
    )
  }, [getVaultCategories])

  return (
    <Flex>
      <Sidebar highlightMenu={PathRoute.DASHBOARDS}>
        <DashboardsTemplate
          loading={loadingVaults}
          vaults={vaults}
          vaultCategories={vaultCategories}
        />
      </Sidebar>
    </Flex>
  )
}
