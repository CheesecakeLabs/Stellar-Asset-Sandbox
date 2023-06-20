import { Flex, Text } from '@chakra-ui/react'
import React from 'react'

import { mockupAssets } from 'utils/mockups'

import { AssetActions } from 'components/enums/asset-actions'
import { MenuActionsAsset } from 'components/organisms/menu-actions-asset'
import { Sidebar } from 'components/organisms/sidebar'
import { MintAssetTemplate } from 'components/templates/mint-asset'

export const DistributeAsset: React.FC = () => {
  return (
    <Flex>
      <Sidebar>
        <Flex flexDir="row" w="full" justifyContent="center">
          <Flex maxW="584px" flexDir="column" w="full">
            <Text fontSize="2xl" fontWeight="400" mb="1rem">
              {`${mockupAssets[0].name} (${mockupAssets[0].code})`}
            </Text>
            <MintAssetTemplate asset={mockupAssets[0]} />
          </Flex>
          <MenuActionsAsset action={AssetActions.DISTRIBUTE} />
        </Flex>
      </Sidebar>
    </Flex>
  )
}
