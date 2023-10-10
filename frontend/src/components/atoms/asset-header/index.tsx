import { Flex, Text } from '@chakra-ui/react'

import { getCurrencyIcon } from 'utils/constants/constants'
import { typesAsset } from 'utils/constants/data-constants'

interface IAssetHeader {
  asset: Hooks.UseAssetsTypes.IAssetDto
}

export const AssetHeader: React.FC<IAssetHeader> = ({ asset }) => {
  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      borderBottom="1px solid"
      borderColor={'gray.600'}
      h="3.5rem"
      px="1rem"
      fill="black"
      stroke="black"
      _dark={{ fill: 'white', stroke: 'white', borderColor: 'black.800' }}
    >
      <Flex gap="1rem" alignItems="center">
        {getCurrencyIcon(asset.code)}
        <Text fontSize="sm" fontWeight="600">
          {`${asset.name} (${asset.code})`}
        </Text>
      </Flex>
      <Text fontSize="sm" mr="0.5rem">
        {typesAsset.find(type => type.id === asset.asset_type)?.name || ''}
      </Text>
    </Flex>
  )
}
