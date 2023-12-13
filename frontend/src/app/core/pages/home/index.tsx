import { Flex } from '@chakra-ui/react'
import React, { useEffect } from 'react'

import { useAssets } from 'hooks/useAssets'
import { useAuth } from 'hooks/useAuth'

import { PathRoute } from 'components/enums/path-route'
import { Sidebar } from 'components/organisms/sidebar'
import { HomeTemplate } from 'components/templates/home'

export const Home: React.FC = () => {
  const { loadingAssets, getAssets, assets } = useAssets()
  const { userPermissions, loadingUserPermissions, getUserPermissions } =
    useAuth()

  useEffect(() => {
    getAssets()
  }, [getAssets])

  useEffect(() => {
    getUserPermissions()
  }, [getUserPermissions])

  return (
    <Flex>
      <Sidebar highlightMenu={PathRoute.HOME}>
        <HomeTemplate
          loading={loadingAssets || loadingUserPermissions}
          assets={assets}
          userPermissions={userPermissions}
        />
      </Sidebar>
    </Flex>
  )
}
