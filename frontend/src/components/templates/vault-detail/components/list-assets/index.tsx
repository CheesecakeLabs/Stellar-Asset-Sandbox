import { Box, Container, Flex, Text } from '@chakra-ui/react'
import React, { Dispatch, SetStateAction } from 'react'

import { toCrypto } from 'utils/formatter'

import { ChevronRight, CoinIcon, LockIcon } from 'components/icons'

interface IListAssets {
  vault: Hooks.UseVaultsTypes.IVault
  assets: Hooks.UseAssetsTypes.IAssetDto[] | undefined
  setSelectedAsset: Dispatch<
    SetStateAction<Hooks.UseAssetsTypes.IAssetDto | undefined>
  >
  selectedAsset: Hooks.UseAssetsTypes.IAssetDto | undefined
}

export const ListAssets: React.FC<IListAssets> = ({
  vault,
  setSelectedAsset,
  assets,
  selectedAsset,
}) => {
  const getAsset = (
    assetData: Hooks.UseHorizonTypes.IBalance
  ): Hooks.UseAssetsTypes.IAssetDto | undefined => {
    return assets?.find(
      asset =>
        asset.code === assetData.asset_code &&
        asset.issuer.key.publicKey === assetData.asset_issuer
    )
  }

  return (
    <Container variant="primary" justifyContent="center" p="0">
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
        <Text fontSize="sm" fontWeight="600">
          Assets
        </Text>
      </Flex>
      <Box>
        <Flex
          justifyContent="space-between"
          alignItems="center"
          borderBottom="1px solid"
          borderColor="gray.100"
          h="3.5rem"
          px="1rem"
          cursor="pointer"
        >
          <Flex alignItems="center" gap={3} fontWeight="700">
            <Text fontSize="sm">Distributor</Text>
          </Flex>
          <Flex alignItems="center" gap={2}>
            <Flex ms="0.5rem" fill="gray.650" _dark={{ fill: 'white' }}>
              <ChevronRight />
            </Flex>
          </Flex>
        </Flex>
        {vault.accountData &&
          vault.accountData.balances.map(
            balance =>
              balance.asset_code && (
                <Flex
                  justifyContent="space-between"
                  alignItems="center"
                  borderBottom="1px solid"
                  borderColor="gray.100"
                  h="3.5rem"
                  px="1rem"
                  cursor="pointer"
                  onClick={(): void => {
                    if (selectedAsset === getAsset(balance)) {
                      setSelectedAsset(undefined)
                      return
                    }
                    setSelectedAsset(getAsset(balance))
                  }}
                  bg={
                    selectedAsset === getAsset(balance) ? 'gray.100' : 'white'
                  }
                >
                  <Flex
                    alignItems="center"
                    gap={3}
                    fill="black"
                    stroke="black"
                    _dark={{ fill: 'white', stroke: 'white' }}
                  >
                    <CoinIcon width="1.5rem" />
                    <Text fontSize="sm">{balance.asset_code}</Text>
                  </Flex>
                  <Flex alignItems="center" gap={2}>
                    <Text fontSize="xs" fontWeight="700" color="gray.900">
                      {toCrypto(Number(balance.balance))}
                    </Text>
                    {!balance.is_authorized && <LockIcon width="1rem" />}
                    <Flex ms="0.5rem" fill="gray.650" _dark={{ fill: 'white' }}>
                      <ChevronRight />
                    </Flex>
                  </Flex>
                </Flex>
              )
          )}
      </Box>
    </Container>
  )
}
