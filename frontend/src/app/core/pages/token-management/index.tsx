import { Flex } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'

import { useAssets } from 'hooks/useAssets'
import { useAuth } from 'hooks/useAuth'
import { GAService } from 'utils/ga'

import { PathRoute } from 'components/enums/path-route'
import { Sidebar } from 'components/organisms/sidebar'
import { TokenManagementTemplate } from 'components/templates/token-management'

export const TokenManagement: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [pagedAssets, setPagedAssets] =
    useState<Hooks.UseAssetsTypes.IPagedAssets>()
  const { getPagedAssets } = useAssets()
  const { userPermissions, getUserPermissions } = useAuth()
  const [page, setPage] = useState(1)

  useEffect(() => {
    GAService.GAPageView('Token Management')
  }, [])

  const LIMIT = 10

  useEffect(() => {
    getPagedAssets({
      page: page,
      limit: LIMIT,
    }).then(pagedAssets => {
      setPagedAssets(pagedAssets)
      setLoading(false)
    })
  }, [getPagedAssets, page])

  useEffect(() => {
    getUserPermissions()
  }, [getUserPermissions])

  const changePage = (pageSelected: number): void => {
    setLoading(true)
    getPagedAssets({
      page: pageSelected,
      limit: LIMIT,
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
        />
      </Sidebar>
    </Flex>
  )
}
