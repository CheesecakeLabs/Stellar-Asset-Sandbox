import { Flex } from '@chakra-ui/react'
import React, { useCallback, useEffect, useState } from 'react'

import { useAssets } from 'hooks/useAssets'
import { useAuth } from 'hooks/useAuth'
import { GAService } from 'utils/ga'

import { PathRoute } from 'components/enums/path-route'
import { Sidebar } from 'components/organisms/sidebar'
import { TokenManagementTemplate } from 'components/templates/token-management'

export interface IOptionFilter {
  readonly label: string
  readonly value: string
}

export const TokenManagement: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [pagedAssets, setPagedAssets] =
    useState<Hooks.UseAssetsTypes.IPagedAssets>()
  const { getPagedAssets } = useAssets()
  const { userPermissions, getUserPermissions } = useAuth()
  const [page, setPage] = useState(1)
  const [textSearch, setTextSearch] = useState<string>()
  const [filterByAssetType, setFilterByAssetType] = useState<IOptionFilter>()
  const [filterByAssetFlag, setFilterByAssetFlag] = useState<IOptionFilter[]>(
    []
  )

  useEffect(() => {
    GAService.GAPageView('Token Management')
  }, [])

  const LIMIT = 10

  const getFilters = useCallback((): Hooks.UseAssetsTypes.IFilter => {
    return {
      name: textSearch,
      authorize_required:
        filterByAssetFlag.find(item => item.value === 'AUTHORIZE_REQUIRED') !=
        undefined,
      clawback_enabled:
        filterByAssetFlag.find(item => item.value === 'CLAWBACK_ENABLED') !=
        undefined,
      freeze_enabled:
        filterByAssetFlag.find(item => item.value === 'FREEZE_ENABLED') !=
        undefined,
      asset_type: filterByAssetType?.value,
    }
  }, [filterByAssetFlag, filterByAssetType?.value, textSearch])

  useEffect(() => {
    getPagedAssets({
      page: page,
      limit: LIMIT,
      filters: getFilters(),
    }).then(pagedAssets => {
      setPagedAssets(pagedAssets)
      setLoading(false)
    })
  }, [
    getPagedAssets,
    page,
    textSearch,
    filterByAssetFlag,
    filterByAssetType,
    getFilters,
  ])

  useEffect(() => {
    getUserPermissions()
  }, [getUserPermissions])

  const changePage = (pageSelected: number): void => {
    setLoading(true)
    getPagedAssets({
      page: pageSelected,
      limit: LIMIT,
      filters: getFilters(),
    }).then(pagedAssets => {
      setPagedAssets(pagedAssets)
      setLoading(false)
      setPage(pageSelected)
    })
  }

  return (
    <Flex>
      <Sidebar highlightMenu={PathRoute.TOKEN_MANAGEMENT}>
        <TokenManagementTemplate
          loading={loading}
          assets={pagedAssets?.assets}
          userPermissions={userPermissions}
          currentPage={page}
          totalPages={pagedAssets?.totalPages || 1}
          changePage={changePage}
          setTextSearch={setTextSearch}
          setFilterByAssetFlag={setFilterByAssetFlag}
          setFilterByAssetType={setFilterByAssetType}
        />
      </Sidebar>
    </Flex>
  )
}
