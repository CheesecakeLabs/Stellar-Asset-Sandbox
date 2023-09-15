import { Text, Container, Flex, Box } from '@chakra-ui/react'
import React, { Dispatch, SetStateAction } from 'react'

import { getCurrencyIcon } from 'utils/constants/constants'
import { toCrypto } from 'utils/formatter'

interface IAssetItem {
  asset: Hooks.UseAssetsTypes.IAssetDto
  assetSelected: Hooks.UseAssetsTypes.IAssetDto | undefined
  setAssetSelected: Dispatch<
    SetStateAction<Hooks.UseAssetsTypes.IAssetDto | undefined>
  >
  onSelectAsset(asset: Hooks.UseAssetsTypes.IAssetDto): void
}

export const AssetItem: React.FC<IAssetItem> = ({
  asset,
  assetSelected,
  onSelectAsset,
}) => {
  return (
    <Container
      variant="primary"
      w="fit-content"
      justifyContent="center"
      p="0.5rem"
      mr="0.5rem"
      cursor="pointer"
      bg={asset.id === assetSelected?.id ? 'primary.normal' : undefined}
      onClick={(): void => {
        onSelectAsset(asset)
      }}
      _hover={asset.id === assetSelected?.id ? undefined : { bg: 'purple.50' }}
    >
      <Flex alignItems="center" h="full">
        <Box
          w="2rem"
          fill={asset.id === assetSelected?.id ? 'white' : 'black'}
          stroke={asset.id === assetSelected?.id ? 'white' : 'black'}
          _dark={{ fill: 'white', stroke: 'white' }}
        >
          {getCurrencyIcon(asset.code, '1.5rem')}
        </Box>
        <Flex ms="0.75rem" flexDir="column" w="full" h="min-content">
          <Text
            fontSize="sm"
            fontWeight="700"
            color={asset.id === assetSelected?.id ? 'white' : undefined}
          >
            {asset.code}
          </Text>
          <Text
            fontSize="xs"
            color={asset.id === assetSelected?.id ? 'white' : undefined}
          >
            {toCrypto(Number(asset.assetData?.amount || 0))}
          </Text>
        </Flex>
      </Flex>
    </Container>
  )
}