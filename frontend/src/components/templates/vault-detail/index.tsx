import { Flex, Tag, Text } from '@chakra-ui/react'
import React from 'react'
import { FieldValues, UseFormSetValue } from 'react-hook-form'

import { DistributeVault } from './components/distribute'
import { ListAssets } from './components/list-assets'

interface IVaultDetailTemplate {
  vault: Hooks.UseVaultsTypes.IVault
  onSubmit(
    data: FieldValues,
    setValue: UseFormSetValue<FieldValues>,
    wallet: string | undefined,
    asset: Hooks.UseAssetsTypes.IAssetDto | undefined
  ): Promise<void>
  loading: boolean
  assets: Hooks.UseAssetsTypes.IAssetDto[] | undefined
  vaults: Hooks.UseVaultsTypes.IVault[] | undefined
}

export const VaultDetailTemplate: React.FC<IVaultDetailTemplate> = ({
  vault,
  onSubmit,
  loading,
  assets,
  vaults,
}) => {
  const filteredVaults = vaults?.filter(
    (itemVault: Hooks.UseVaultsTypes.IVault) => itemVault.id !== vault.id
  )

  return (
    <Flex flexDir="column" w="full">
      <Flex maxW="860px" alignSelf="center" flexDir="column" w="full">
        <Flex alignItems="center" mb="1.5rem">
          <Text fontSize="2xl" fontWeight="400">
            {vault.name}
          </Text>
          <Tag
            variant="blue"
            ms="1rem"
            textAlign="center"
            fontSize="xs"
            fontWeight="700"
            w="fit-content"
          >
            {vault.vault_category.name}
          </Tag>
        </Flex>
        <Flex gap="1rem">
          <ListAssets vault={vault} />
          <DistributeVault
            onSubmit={onSubmit}
            loading={loading}
            assets={assets}
            vaults={filteredVaults}
          />
        </Flex>
      </Flex>
    </Flex>
  )
}
