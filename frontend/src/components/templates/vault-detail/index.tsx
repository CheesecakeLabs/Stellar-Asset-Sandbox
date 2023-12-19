import { Flex, Skeleton, useMediaQuery } from '@chakra-ui/react'
import React from 'react'
import { FieldValues, UseFormSetValue } from 'react-hook-form'

import { havePermission } from 'utils'
import { MAX_PAGE_WIDTH } from 'utils/constants/sizes'

import { DistributeVault } from './components/distribute'
import { Header } from './components/header'
import { ListAssets } from './components/list-assets'
import { ListPayments } from './components/list-payments'
import { LoaderSkeleton } from './components/loader-skeleton'
import { Permissions } from 'components/enums/permissions'

interface IVaultDetailTemplate {
  vault: Hooks.UseVaultsTypes.IVault | undefined
  loadingAssets: boolean
  loadingVaults: boolean
  loadingOperation: boolean
  assets: Hooks.UseAssetsTypes.IAssetDto[] | undefined
  vaults: Hooks.UseVaultsTypes.IVault[] | undefined
  vaultsByAsset: Hooks.UseVaultsTypes.IVault[] | undefined
  payments: Hooks.UseHorizonTypes.IPayments | undefined
  selectedAsset: Hooks.UseAssetsTypes.IAssetDto | undefined
  loadingHorizon: boolean
  updatingVault: boolean
  updatingVaultAssets: boolean
  vaultCategories: Hooks.UseVaultsTypes.IVaultCategory[] | undefined
  deletingVault: boolean
  isPrevDisabled: boolean
  userPermissions: Hooks.UseAuthTypes.IUserPermission[] | undefined
  loadingUserPermissions: boolean
  onSubmit(
    amount: string,
    setValue: UseFormSetValue<FieldValues>,
    wallet: string | undefined
  ): Promise<void>
  createVaultCategory(
    vaultCategory: Hooks.UseVaultsTypes.IVaultCategoryRequest
  ): Promise<Hooks.UseVaultsTypes.IVaultCategory | undefined>
  onUpdateVault(params: Hooks.UseVaultsTypes.IVaultUpdateParams): Promise<void>
  onUpdateVaultAssets(
    listEdit: Hooks.UseHorizonTypes.IBalance[]
  ): Promise<boolean>
  onDeleteVault(): Promise<void>
  getPaymentsDataByLink(link: 'prev' | 'next'): void
  changeAsset(asset: Hooks.UseAssetsTypes.IAssetDto | undefined): Promise<void>
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
  updatingVaultAssets,
  deletingVault,
  isPrevDisabled,
  userPermissions,
  loadingUserPermissions,
  vaultsByAsset,
  onUpdateVault,
  onSubmit,
  createVaultCategory,
  onUpdateVaultAssets,
  onDeleteVault,
  getPaymentsDataByLink,
  changeAsset,
}) => {
  const [isLargerThanMd] = useMediaQuery('(min-width: 768px)')

  const filteredVaults = vaultsByAsset?.filter(
    (itemVault: Hooks.UseVaultsTypes.IVault) => itemVault.id !== vault?.id
  )

  return (
    <Flex flexDir="column" w="full">
      <Flex maxW={MAX_PAGE_WIDTH} alignSelf="center" flexDir="column" w="full">
        {loadingAssets ||
        (!vaults && loadingVaults) ||
        !vault ||
        loadingUserPermissions ? (
          <LoaderSkeleton />
        ) : (
          <>
            <Header
              vault={vault}
              vaultCategories={vaultCategories}
              category={vault.vault_category}
              updatingVault={updatingVault}
              deletingVault={deletingVault}
              createVaultCategory={createVaultCategory}
              onUpdateVault={onUpdateVault}
              onDeleteVault={onDeleteVault}
            />
            <Flex gap="1rem" flexDir={isLargerThanMd ? 'row' : 'column'}>
              <ListAssets
                vault={vault}
                assets={assets}
                selectedAsset={selectedAsset}
                updatingVaultAssets={updatingVaultAssets}
                onUpdateVaultAssets={onUpdateVaultAssets}
                changeAsset={changeAsset}
              />
              {(havePermission(
                Permissions.MOVE_BALANCES_VAULTS,
                userPermissions
              ) ||
                havePermission(
                  Permissions.MOVE_BALANCES_EXTERNAL_ACCOUNTS,
                  userPermissions
                )) &&
                (loadingVaults ? (
                  <Skeleton w="full" />
                ) : (
                  <DistributeVault
                    onSubmit={onSubmit}
                    loading={loadingOperation}
                    vaults={filteredVaults}
                    vault={vault}
                    selectedAsset={selectedAsset}
                    userPermissions={userPermissions}
                  />
                ))}
            </Flex>
            <Flex mt="1rem" w="full">
              {!payments && loadingHorizon ? (
                <Skeleton height="4rem" w="full" />
              ) : (
                <ListPayments
                  payments={payments}
                  vaults={vaults}
                  vault={vault}
                  assets={assets}
                  isPrevDisabled={isPrevDisabled}
                  getPaymentsDataByLink={getPaymentsDataByLink}
                />
              )}
            </Flex>
          </>
        )}
      </Flex>
    </Flex>
  )
}
