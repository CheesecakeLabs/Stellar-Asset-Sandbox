import { Flex } from '@chakra-ui/react'
import React from 'react'

import { Sidebar } from 'components/organisms/sidebar'
import { ForgeAssetTemplate } from 'components/templates/forge-asset'

export const ForgeAsset: React.FC = () => {
  return (
    <Flex>
      <Sidebar>
        <ForgeAssetTemplate />
      </Sidebar>
    </Flex>
  )
}
