import { Box, Button, Container, Flex, Text } from '@chakra-ui/react'
import React from 'react'

import { toCrypto } from 'utils/formatter'

import { AssetHeader } from 'components/atoms'

interface IAssetHomeTemplate {
  loading: boolean
  asset: Hooks.UseAssetsTypes.IAssetDto
}

export const AssetHomeTemplate: React.FC<IAssetHomeTemplate> = ({
  loading,
  asset,
}) => {
  return (
    <Flex flexDir="column" w="full">
      <Container variant="primary" justifyContent="center" maxW="full" p="0">
        <AssetHeader asset={asset} />
        <Box p="1rem" w="full">
          <Text
            color="gray.900"
            fontWeight="600"
            fontSize="xs"
            mt="0.5rem"
            ms="0.25rem"
          >
            {`Circulation supply: ${
              asset.assetData
                ? `${toCrypto(Number(asset.assetData.amount))} ${asset.code}`
                : 'loading'
            }`}
          </Text>
          <Flex justifyContent="flex-end">
            <Button
              type="submit"
              variant="primary"
              mt="1.5rem"
              isLoading={loading}
            >
              Mint asset
            </Button>
          </Flex>
        </Box>
      </Container>
    </Flex>
  )
}
