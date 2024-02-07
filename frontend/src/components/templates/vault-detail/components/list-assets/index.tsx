import {
  Box,
  Button,
  Container,
  Flex,
  IconButton,
  Text,
} from '@chakra-ui/react'
import React, { useState } from 'react'

import { EditIcon } from 'components/icons'
import { SelectAssets } from 'components/molecules/select-assets'

import { ItemAsset } from '../item-asset'

interface IListAssets {
  vault: Hooks.UseVaultsTypes.IVault
  assets: Hooks.UseAssetsTypes.IAssetDto[] | undefined
  selectedAsset: Hooks.UseAssetsTypes.IAssetDto | undefined
  updatingVaultAssets: boolean
  changeAsset(asset: Hooks.UseAssetsTypes.IAssetDto | undefined): Promise<void>
  onUpdateVaultAssets(
    listEdit: Hooks.UseHorizonTypes.IBalance[]
  ): Promise<boolean>
}

export const ListAssets: React.FC<IListAssets> = ({
  vault,
  assets,
  selectedAsset,
  updatingVaultAssets,
  changeAsset,
  onUpdateVaultAssets,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [listEdit, setListEdit] = useState<
    Hooks.UseHorizonTypes.IBalance[] | undefined
  >(vault.accountData?.balances)

  const removeAsset = (
    balanceSelected: Hooks.UseHorizonTypes.IBalance
  ): void => {
    setListEdit(listEdit?.filter(balance => balance !== balanceSelected))
  }

  const onSave = (): void => {
    onUpdateVaultAssets(listEdit || []).then(success => {
      if (success) {
        setIsEditing(false)
      }
    })
  }

  const onChangeAssets = (assetAdded: Hooks.UseAssetsTypes.IAssetDto): void => {
    if (listEdit) {
      setListEdit([
        ...listEdit,
        {
          balance: '0',
          is_authorized: true,
          asset_code: assetAdded?.code,
          asset_issuer: assetAdded?.issuer.key.publicKey,
        },
      ])
    }
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
        {isEditing ? (
          <Flex gap={2}>
            <Button
              variant="secondary"
              onClick={(): void => {
                setIsEditing(false)
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={onSave}
              isLoading={updatingVaultAssets}
            >
              Save
            </Button>
          </Flex>
        ) : (
          <IconButton
            icon={<EditIcon width="16px" />}
            aria-label="Edit"
            onClick={(): void => {
              setListEdit(vault.accountData?.balances)
              setIsEditing(true)
            }}
          />
        )}
      </Flex>
      <Box>
        {isEditing
          ? listEdit &&
            listEdit.map(
              (balance, index) =>
                balance.asset_code && (
                  <ItemAsset
                    key={index}
                    balance={balance}
                    assets={assets}
                    changeAsset={changeAsset}
                    selectedAsset={selectedAsset}
                    isEditing={isEditing}
                    removeAsset={removeAsset}
                  />
                )
            )
          : vault.accountData &&
            vault.accountData.balances.map(
              (balance, index) =>
                balance.asset_code && (
                  <ItemAsset
                    key={index}
                    balance={balance}
                    assets={assets}
                    changeAsset={changeAsset}
                    selectedAsset={selectedAsset}
                    isEditing={isEditing}
                    removeAsset={removeAsset}
                  />
                )
            )}
        {isEditing && (
          <Flex p="1rem" w="full" maxW="full" alignItems="center" gap={3}>
            <Box w="full">
              <SelectAssets
                assets={assets?.filter(
                  asset =>
                    !listEdit?.some(
                      balance =>
                        asset.code === balance.asset_code &&
                        asset.issuer.key.publicKey === balance.asset_issuer
                    )
                )}
                onChange={onChangeAssets}
              />
            </Box>
          </Flex>
        )}
      </Box>
    </Container>
  )
}
