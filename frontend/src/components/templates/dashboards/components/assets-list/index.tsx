import { Text, Container, Flex, Box } from '@chakra-ui/react'
import React from 'react'

import { getCurrencyIcon } from 'utils/constants/constants'
import { toCrypto } from 'utils/formatter'

import { HelpIcon } from 'components/icons'

interface IAssetsList {
  assets: Hooks.UseAssetsTypes.IAssetDto[] | undefined
  loadingAssets: boolean
}

export const AssetsList: React.FC<IAssetsList> = ({ assets }) => {
  return (
    <Container
      variant="primary"
      justifyContent="center"
      py="0.5rem"
      px="0.75rem"
      w="full"
      maxW="280px"
      mt="1rem"
    >
      <Flex justifyContent="space-between" mb="1.25rem">
        <Text fontSize="xs" fontWeight="600">
          Assets
        </Text>
        <Flex>
          <HelpIcon />
        </Flex>
      </Flex>
      {assets?.map(asset => (
        <Flex
          alignItems="center"
          px="0.5rem"
          pb="0.5rem"
          mb="0.5rem"
          borderBottom="1px solid"
          borderColor={'gray.600'}
          _dark={{ borderColor: 'black.800', fill: 'white' }}
        >
          <Box
            w="2rem"
            fill="black"
            stroke="black"
            _dark={{ fill: 'white', stroke: 'white' }}
          >
            {getCurrencyIcon(asset.code, '1.5rem')}
          </Box>
          <Flex ms="0.75rem" flexDir="column" w="full">
            <Text fontSize="sm" fontWeight="700">
              {asset.code}
            </Text>
            <Text fontSize="xs">
              {toCrypto(Number(asset.assetData?.amount || 0))} {asset.code}
            </Text>
          </Flex>
        </Flex>
      ))}
    </Container>
  )
}
