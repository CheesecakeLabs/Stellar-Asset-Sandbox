import { Flex, Skeleton } from '@chakra-ui/react'
import React, { Dispatch, SetStateAction } from 'react'
import { FieldValues, UseFormSetValue } from 'react-hook-form'

import { DistributeVault } from './components/distribute'
import { Header } from './components/header'
import { ListAssets } from './components/list-assets'
import { ListPayments } from './components/list-payments'
import { LoaderSkeleton } from './components/loader-skeleton'

interface IVaultDetailTemplate {
  vault: Hooks.UseVaultsTypes.IVault | undefined
  loadingAssets: boolean
  loadingVaults: boolean
  loadingOperation: boolean
  assets: Hooks.UseAssetsTypes.IAssetDto[] | undefined
  vaults: Hooks.UseVaultsTypes.IVault[] | undefined
  payments: Hooks.UseHorizonTypes.IPayment[] | undefined
  selectedAsset: Hooks.UseAssetsTypes.IAssetDto | undefined
  loadingHorizon: boolean
  updatingVault: boolean
  vaultCategories: Hooks.UseVaultsTypes.IVaultCategory[] | undefined
  onSubmit(
    data: FieldValues,
    setValue: UseFormSetValue<FieldValues>,
    wallet: string | undefined
  ): Promise<void>
  setSelectedAsset: Dispatch<
    SetStateAction<Hooks.UseAssetsTypes.IAssetDto | undefined>
  >
  createVaultCategory(
    vaultCategory: Hooks.UseVaultsTypes.IVaultCategoryRequest
  ): Promise<Hooks.UseVaultsTypes.IVaultCategory | undefined>
  onUpdateVault(params: Hooks.UseVaultsTypes.IVaultUpdateParams): Promise<void>
}

export const VaultDetailTemplate: React.FC<IVaultDetailTemplate> = ({
  vault,
  loadingAssets,
  loadingVaults,
  loadingOperation,
  assets,
  vaults,
  payments,
  selectedAsset,
  loadingHorizon,
  vaultCategories,
  updatingVault,
  onUpdateVault,
  onSubmit,
  setSelectedAsset,
  createVaultCategory,
}) => {
  const filteredVaults = vaults?.filter(
    (itemVault: Hooks.UseVaultsTypes.IVault) => itemVault.id !== vault?.id
  )

  return (
    <Flex flexDir="column" w="full">
      <Flex maxW="860px" alignSelf="center" flexDir="column" w="full">
        {loadingAssets || loadingVaults || !vault ? (
          <LoaderSkeleton />
        ) : (
          <>
            <Header
              vault={vault}
              createVaultCategory={createVaultCategory}
              vaultCategories={vaultCategories}
              category={vault.vault_category}
              onUpdateVault={onUpdateVault}
              updatingVault={updatingVault}
            />
            <Flex gap="1rem">
              <ListAssets
                vault={vault}
                assets={assets}
                setSelectedAsset={setSelectedAsset}
                selectedAsset={selectedAsset}
              />
              <DistributeVault
                onSubmit={onSubmit}
                loading={loadingOperation}
                vaults={filteredVaults}
                vault={vault}
                selectedAsset={selectedAsset}
              />
            </Flex>
            <Flex mt="1rem" w="full">
              {loadingHorizon ? (
                <Skeleton height="4rem" w="full" />
              ) : (
                <ListPayments
                  payments={payments}
                  vaults={vaults}
                  vault={vault}
                  loading={loadingHorizon}
                  assets={assets}
                />
              )}
            </Flex>
          </>
        )}
      </Flex>
    </Flex>
  )
}
