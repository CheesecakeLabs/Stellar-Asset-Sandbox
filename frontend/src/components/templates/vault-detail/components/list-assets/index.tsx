import { Box, Container, Flex, Text } from '@chakra-ui/react'
import React, { Dispatch, SetStateAction } from 'react'

import { getCurrencyIcon } from 'utils/constants/constants'
import { toCrypto } from 'utils/formatter'

import { ChevronRight, LockIcon } from 'components/icons'

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
        {vault.accountData &&
          vault.accountData.balances.map(
            (balance, index) =>
              balance.asset_code && (
                <Flex
                  key={index}
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
                  _dark={
                    selectedAsset
                      ? { bg: 'black.600', borderColor: 'black.800' }
                      : { bg: 'none', borderColor: 'black.800' }
                  }
                >
                  <Flex
                    alignItems="center"
                    gap={3}
                    fill="black"
                    stroke="black"
                    _dark={{ fill: 'white', stroke: 'white' }}
                  >
                    {getCurrencyIcon(balance.asset_code, '1.5rem')}{' '}
                    <Text fontSize="sm">{balance.asset_code}</Text>
                  </Flex>
                  <Flex alignItems="center" gap={2}>
                    <Text
                      fontSize="xs"
                      fontWeight="700"
                      color="gray.900"
                      _dark={{ color: 'white' }}
                    >
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
