import { Flex } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'

import { useAssets } from 'hooks/useAssets'
import { useAuth } from 'hooks/useAuth'

import { PathRoute } from 'components/enums/path-route'
import { Sidebar } from 'components/organisms/sidebar'
import { TokenManagementTemplate } from 'components/templates/token-management'

export const TokenManagement: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [assets, setAssets] = useState<Hooks.UseAssetsTypes.IAssetDto[]>()
  const { getAssets } = useAssets()
  const { userPermissions, getUserPermissions } = useAuth()

  useEffect(() => {
    getAssets().then(assets => {
      setAssets(assets)
      setLoading(false)
    })
  }, [getAssets])

  useEffect(() => {
    getUserPermissions()
  }, [getUserPermissions])

  return (
    <Flex>
      <Sidebar highlightMenu={PathRoute.TOKEN_MANAGEMENT}>
        <TokenManagementTemplate
          loading={loading}
          assets={assets}
          userPermissions={userPermissions}
        />
      </Sidebar>
    </Flex>
  )
}
