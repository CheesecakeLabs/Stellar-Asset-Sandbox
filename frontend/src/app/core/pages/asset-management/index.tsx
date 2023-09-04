import { Flex } from '@chakra-ui/react'
import React, { useEffect } from 'react'

import { useAssets } from 'hooks/useAssets'

import { PathRoute } from 'components/enums/path-route'
import { Sidebar } from 'components/organisms/sidebar'
import { HomeTemplate } from 'components/templates/home'

export const AssetManagement: React.FC = () => {
  const { loadingAssets, getAssets, assets } = useAssets()

  useEffect(() => {
    getAssets()
  }, [getAssets])
  return (
    <Flex>
      <Sidebar highlightMenu={PathRoute.ASSET_MANAGEMENT}>
        <HomeTemplate loading={loadingAssets} assets={assets} />
      </Sidebar>
    </Flex>
  )
}
