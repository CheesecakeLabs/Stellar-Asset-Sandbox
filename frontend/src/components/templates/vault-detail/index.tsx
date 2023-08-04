import { Flex, Tag, Text } from '@chakra-ui/react'
import React, { Dispatch, SetStateAction } from 'react'
import { FieldValues, UseFormSetValue } from 'react-hook-form'

import { DistributeVault } from './components/distribute'
import { ListAssets } from './components/list-assets'
import { ListPayments } from './components/list-payments'
import { Loading } from 'components/atoms'

interface IVaultDetailTemplate {
  vault: Hooks.UseVaultsTypes.IVault | undefined
  onSubmit(
    data: FieldValues,
    setValue: UseFormSetValue<FieldValues>,
    wallet: string | undefined
  ): Promise<void>
  loading: boolean
  assets: Hooks.UseAssetsTypes.IAssetDto[] | undefined
  vaults: Hooks.UseVaultsTypes.IVault[] | undefined
  payments: Hooks.UseHorizonTypes.IPayment[] | undefined
  setSelectedAsset: Dispatch<
    SetStateAction<Hooks.UseAssetsTypes.IAssetDto | undefined>
  >
  selectedAsset: Hooks.UseAssetsTypes.IAssetDto | undefined
}

export const VaultDetailTemplate: React.FC<IVaultDetailTemplate> = ({
  vault,
  onSubmit,
  setSelectedAsset,
  loading,
  assets,
  vaults,
  payments,
  selectedAsset,
}) => {
  const filteredVaults = vaults?.filter(
    (itemVault: Hooks.UseVaultsTypes.IVault) => itemVault.id !== vault?.id
  )

  return (
    <Flex flexDir="column" w="full">
      <Flex maxW="860px" alignSelf="center" flexDir="column" w="full">
        {vault ? (
          <>
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
              <ListAssets
                vault={vault}
                assets={assets}
                setSelectedAsset={setSelectedAsset}
                selectedAsset={selectedAsset}
              />
              <DistributeVault
                onSubmit={onSubmit}
                loading={loading}
                vaults={filteredVaults}
                selectedAsset={selectedAsset}
              />
            </Flex>
            <Flex mt="1rem" w="full">
              <ListPayments
                payments={payments}
                vaults={vaults}
                vault={vault}
                distributorWallet={
                  selectedAsset?.distributor.key.publicKey || ''
                }
              />
            </Flex>
          </>
        ) : (
          <Loading />
        )}
      </Flex>
    </Flex>
  )
}
