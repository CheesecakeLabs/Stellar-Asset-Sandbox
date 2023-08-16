import {
  Box,
  Button,
  Container,
  Flex,
  IconButton,
  Text,
} from '@chakra-ui/react'
import React, { Dispatch, SetStateAction, useState } from 'react'

import { AddIcon, EditIcon } from 'components/icons'
import { IOption, SelectAsset } from 'components/molecules/select-asset'

import { ItemAsset } from '../item-asset'

interface IListAssets {
  vault: Hooks.UseVaultsTypes.IVault
  assets: Hooks.UseAssetsTypes.IAssetDto[] | undefined
  selectedAsset: Hooks.UseAssetsTypes.IAssetDto | undefined
  updatingVaultAssets: boolean
  setSelectedAsset: Dispatch<
    SetStateAction<Hooks.UseAssetsTypes.IAssetDto | undefined>
  >
  onUpdateVaultAssets(listEdit: Hooks.UseHorizonTypes.IBalance[]): Promise<void>
}

export const ListAssets: React.FC<IListAssets> = ({
  vault,
  assets,
  selectedAsset,
  updatingVaultAssets,
  setSelectedAsset,
  onUpdateVaultAssets,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [listEdit, setListEdit] = useState<
    Hooks.UseHorizonTypes.IBalance[] | undefined
  >(vault.accountData?.balances)
  const [asset, setAsset] = useState<Hooks.UseAssetsTypes.IAssetDto>()
  const [selected, setSelected] = useState<IOption | null>()

  const removeAsset = (
    balanceSelected: Hooks.UseHorizonTypes.IBalance
  ): void => {
    setListEdit(listEdit?.filter(balance => balance !== balanceSelected))
  }

  const addAsset = (): void => {
    if (listEdit && asset) {
      setSelected(null)
      setListEdit([
        ...listEdit,
        {
          balance: '0',
          is_authorized: true,
          asset_code: asset?.code,
          asset_issuer: asset?.issuer.key.publicKey,
        },
      ])
    }
  }

  const onSave = (): void => {
    onUpdateVaultAssets(listEdit || [])
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
                    setSelectedAsset={setSelectedAsset}
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
                    setSelectedAsset={setSelectedAsset}
                    selectedAsset={selectedAsset}
                    isEditing={isEditing}
                    removeAsset={removeAsset}
                  />
                )
            )}
        {isEditing && (
          <Flex p="1rem" w="full" maxW="full" alignItems="center" gap={3}>
            <Box w="full">
              <SelectAsset
                assets={assets?.filter(
                  asset =>
                    !listEdit?.some(
                      balance => asset.code === balance.asset_code
                    )
                )}
                setAsset={setAsset}
                selected={selected}
                setSelected={setSelected}
              />
            </Box>
            <Button
              variant="primary"
              onClick={addAsset}
              fill="white"
              isDisabled={!selected}
              leftIcon={
                <Flex w="1rem" justifyContent="center">
                  <AddIcon />
                </Flex>
              }
            >
              Add
            </Button>
          </Flex>
        )}
      </Box>
    </Container>
  )
}
