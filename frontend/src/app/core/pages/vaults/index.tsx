import { Flex } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'

import { useAssets } from 'hooks/useAssets'
import { useVaults } from 'hooks/useVaults'

import { PathRoute } from 'components/enums/path-route'
import { Sidebar } from 'components/organisms/sidebar'
import { VaultsTemplate } from 'components/templates/vaults'

export const Vaults: React.FC = () => {
  const [vaults, setVaults] = useState<Hooks.UseVaultsTypes.IVault[]>()
  const [vaultCategories, setVaultCategories] =
    useState<Hooks.UseVaultsTypes.IVaultCategory[]>()
  const { loadingVaults, getVaults, getVaultCategories } = useVaults()
  const { assets, getAssets } = useAssets()

  useEffect(() => {
    getVaults().then(vaults => setVaults(vaults))
  }, [getVaults])

  useEffect(() => {
    getVaultCategories().then(vaultCategories =>
      setVaultCategories(vaultCategories)
    )
  }, [getVaultCategories])

  useEffect(() => {
    getAssets()
  }, [getAssets])

  return (
    <Flex>
      <Sidebar highlightMenu={PathRoute.VAULTS}>
        <VaultsTemplate
          loading={loadingVaults}
          vaults={vaults}
          vaultCategories={vaultCategories}
          assets={assets}
        />
      </Sidebar>
    </Flex>
  )
}
