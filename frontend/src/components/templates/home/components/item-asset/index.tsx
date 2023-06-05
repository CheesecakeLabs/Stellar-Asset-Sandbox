import { Flex, Img, Tag, Td, Text, Tr } from '@chakra-ui/react'
import React from 'react'

import { AssetStatus } from 'components/enums'
import { EditIcon } from 'components/icons'

interface IItemAsset {
  asset: Hooks.UseAssetsTypes.IAsset
}

export const ItemAsset: React.FC<IItemAsset> = ({ asset }) => {
  const assetStatusColor = (assetStatus: AssetStatus): string => {
    if (assetStatus === AssetStatus.LIVE) {
      return 'green'
    }
    return 'yellow'
  }

  return (
    <Tr>
      <Td pl={2} pr={0} w="4rem">
        <Img src={asset.icon} w="30px" h="30px" />
      </Td>
      <Td px={0}>
        <Text fontSize="sm" color="primary.normal">
          {asset.name}
        </Text>
        <Text fontSize="xxs" color="primary.light">
          {asset.asset}
        </Text>
      </Td>
      <Td px={0}>
        <Text fontSize="xs" color="gray.700">
          Circulating Supply
        </Text>
        <Flex gap={1}>
          <Text fontSize="md" color="primary.normal">
            {asset.circulating_supply}
          </Text>
          <Text fontSize="sm" color="primary.light">
            units
          </Text>
        </Flex>
      </Td>
      <Td px={0}>
        <Text fontSize="xs" color="gray.700">
          Treasury
        </Text>
        <Flex gap={1}>
          <Text fontSize="md" color="primary.normal">
            {asset.treasury}
          </Text>
          <Text fontSize="sm" color="primary.light">
            units
          </Text>
        </Flex>
      </Td>
      <Td px={0}>
        <Text fontSize="xs" color="gray.700">
          Trustlines
        </Text>
        <Text fontSize="md" color="primary.normal">
          {asset.trustlines}
        </Text>
      </Td>
      <Td
        display="flex"
        justifyContent="flex-end"
        flexDir="column"
        alignItems="flex-end"
        mr={6}
      >
        <Text fontSize="xs" color="gray.700">
          Status
        </Text>
        <Text fontSize="md" color="primary.normal">
          <Tag variant={assetStatusColor(asset.status)}>{asset.status}</Tag>
        </Text>
      </Td>
      <Td w="4rem" p={0}>
        <EditIcon />
      </Td>
    </Tr>
  )
}
