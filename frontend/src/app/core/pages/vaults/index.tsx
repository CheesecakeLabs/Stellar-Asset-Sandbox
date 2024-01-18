import { Flex } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'

import { useAssets } from 'hooks/useAssets'
import { useVaults } from 'hooks/useVaults'
import { GAService } from 'utils/ga'

import { PathRoute } from 'components/enums/path-route'
import { Sidebar } from 'components/organisms/sidebar'
import { VaultsTemplate } from 'components/templates/vaults'

export const Vaults: React.FC = () => {
  const [pagedVaults, setPagedVaults] =
    useState<Hooks.UseVaultsTypes.IPagedVaults>()
  const [loadingVaults, setLoadingVaults] = useState(true)
  const [vaultCategories, setVaultCategories] =
    useState<Hooks.UseVaultsTypes.IVaultCategory[]>()
  const { getPagedVaults, getVaultCategories } = useVaults()
  const { assets, getAssets } = useAssets()
  const [currentPage, setCurrentPage] = useState(1)
  const LIMIT = 12

  useEffect(() => {
    GAService.GAPageView('Treasury')
  }, [])

  useEffect(() => {
    getPagedVaults({
      page: currentPage,
      limit: LIMIT,
    }).then(pagedVaults => {
      setPagedVaults(pagedVaults)
      setLoadingVaults(false)
    })
  }, [getPagedVaults, currentPage])

  useEffect(() => {
    getVaultCategories().then(vaultCategories =>
      setVaultCategories(vaultCategories)
    )
  }, [getVaultCategories])

  useEffect(() => {
    getAssets(true)
  }, [getAssets])

  const changePage = (pageSelected: number): void => {
    setLoadingVaults(true)
    getPagedVaults({
      page: pageSelected,
      limit: LIMIT,
    }).then(pagedAssets => {
      setPagedVaults(pagedAssets)
      setLoadingVaults(false)
      setCurrentPage(pageSelected)
    })
  }

  return (
    <Flex>
      <Sidebar highlightMenu={PathRoute.VAULTS}>
        <VaultsTemplate
          loading={loadingVaults}
          vaults={pagedVaults?.vaults}
          vaultCategories={vaultCategories}
          assets={assets}
          currentPage={currentPage}
          totalPages={pagedVaults?.totalPages || 1}
          changePage={changePage}
        />
      </Sidebar>
    </Flex>
  )
}
