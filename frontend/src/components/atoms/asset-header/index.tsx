import { Flex, Text } from '@chakra-ui/react'

interface IAssetHeader {
  asset: Hooks.UseAssetsTypes.IAsset
}

export const AssetHeader: React.FC<IAssetHeader> = ({ asset }) => {
  return (
    <Flex h="3.5rem" alignItems="center" justifyContent="space-between">
      <Text fontSize="2xl" fontWeight="400">
        {`${asset.name} (${asset.code})`}
      </Text>
      <Text fontSize="sm" color="gray.650" mr="0.5rem">
        {asset.assetType}
      </Text>
    </Flex>
  )
}
