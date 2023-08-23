import { Button, Flex, Text, Tooltip } from '@chakra-ui/react'
import React, { Dispatch, SetStateAction } from 'react'

import { getCurrencyIcon } from 'utils/constants/constants'
import { toCrypto } from 'utils/formatter'

import { ChevronRight, LockIcon } from 'components/icons'

interface IItemAsset {
  balance: Hooks.UseHorizonTypes.IBalance
  assets: Hooks.UseAssetsTypes.IAssetDto[] | undefined
  selectedAsset: Hooks.UseAssetsTypes.IAssetDto | undefined
  isEditing: boolean
  setSelectedAsset: Dispatch<
    SetStateAction<Hooks.UseAssetsTypes.IAssetDto | undefined>
  >
  removeAsset(balanceSelected: Hooks.UseHorizonTypes.IBalance): void
}

export const ItemAsset: React.FC<IItemAsset> = ({
  balance,
  assets,
  selectedAsset,
  isEditing,
  setSelectedAsset,
  removeAsset,
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
    <Flex
      justifyContent="space-between"
      alignItems="center"
      borderBottom="1px solid"
      borderColor="gray.100"
      h="3.5rem"
      px="1rem"
      cursor={!isEditing ? 'pointer' : undefined}
      onClick={(): void => {
        if (isEditing) return
        if (selectedAsset === getAsset(balance)) {
          setSelectedAsset(undefined)
          return
        }
        setSelectedAsset(getAsset(balance))
      }}
      bg={selectedAsset === getAsset(balance) ? 'gray.100' : 'white'}
      _dark={
        selectedAsset === getAsset(balance)
          ? { bg: 'black.600', borderColor: 'black.800' }
          : { bg: 'black.700', borderColor: 'black.800' }
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
          {isEditing ? (
            <Tooltip
              label={
                Number(balance.balance) > 0
                  ? 'You cannot remove an asset that has balance'
                  : ''
              }
              placement="bottom"
            >
              <Button
                variant="delete"
                isDisabled={Number(balance.balance) > 0}
                onClick={(): void => {
                  removeAsset(balance)
                }}
              >
                Remove
              </Button>
            </Tooltip>
          ) : (
            <ChevronRight />
          )}
        </Flex>
      </Flex>
    </Flex>
  )
}
