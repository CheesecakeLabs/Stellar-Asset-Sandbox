import { Flex, Skeleton, useToast, VStack } from '@chakra-ui/react'
import React, { useCallback, useEffect, useState } from 'react'
import { FieldValues, UseFormSetValue } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'

import { useAssets } from 'hooks/useAssets'
import { useAuth } from 'hooks/useAuth'
import { useHorizon } from 'hooks/useHorizon'
import { useVaults } from 'hooks/useVaults'
import { havePermission } from 'utils'
import { distributeHelper } from 'utils/constants/helpers'
import { MessagesError } from 'utils/constants/messages-error'
import { toFixedCrypto } from 'utils/formatter'

import { AssetActions } from 'components/enums/asset-actions'
import { PathRoute } from 'components/enums/path-route'
import { Permissions } from 'components/enums/permissions'
import { ActionHelper } from 'components/molecules/action-helper'
import { ManagementBreadcrumb } from 'components/molecules/management-breadcrumb'
import { MenuActionsAsset } from 'components/organisms/menu-actions-asset'
import { Sidebar } from 'components/organisms/sidebar'
import { DistributeAssetTemplate } from 'components/templates/distribute-asset'

export const DistributeAsset: React.FC = () => {
  const [asset, setAsset] = useState<Hooks.UseAssetsTypes.IAssetDto>()
  const [vaults, setVaults] = useState<Hooks.UseVaultsTypes.IVault[]>()
  const { distribute, getAssetById, loadingOperation, loadingAsset } =
    useAssets()
  const { loadingUserPermissions, userPermissions, getUserPermissions } =
    useAuth()
  const { id } = useParams()
  const { getVaults } = useVaults()
  const { getAssetAccounts } = useHorizon()

  const toast = useToast()
  const navigate = useNavigate()

  const onSubmit = async (
    data: FieldValues,
    setValue: UseFormSetValue<FieldValues>,
    wallet: string | undefined
  ): Promise<void> => {
    if (!asset || !id) return

    try {
      const isSuccess = await distribute({
        source_wallet_id: asset.distributor.id,
        destination_wallet_pk: wallet ? wallet : data.destination_wallet_id,
        asset_id: asset.id.toString(),
        sponsor_id: 1,
        amount: toFixedCrypto(data.amount),
        current_supply: Number(asset.assetData?.amount || 0),
        current_main_vault:
          Number(asset.distributorBalance?.balance || 0) - data.amount,
      })

      if (isSuccess) {
        setValue('destination_wallet_id', '')
        setValue('amount', '')

        toast({
          title: 'Distribute success!',
          description: `You distributed ${data.amount} ${asset.code}`,
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: 'top-right',
        })
        getAssetById(id).then(asset => {
          setAsset(asset)
          filterVaults(asset)
        })
        return
      }

      toastError(MessagesError.errorOccurred)
    } catch (error) {
      let message
      if (error instanceof Error) message = error.message
      else message = String(error)
      toastError(message)
    }
  }

  const toastError = (message: string): void => {
    toast({
      title: 'Distribute error!',
      description: message,
      status: 'error',
      duration: 9000,
      isClosable: true,
      position: 'top-right',
    })
  }

  const filterVaults = useCallback(
    async (
      asset: Hooks.UseAssetsTypes.IAssetDto | undefined
    ): Promise<void> => {
      if (!asset) return
      const assetAccounts = await getAssetAccounts(
        asset.code,
        asset.issuer.key.publicKey
      )
      const vaults = await getVaults()
      const filteredVaults =
        vaults
          ?.filter((vault: Hooks.UseVaultsTypes.IVault) =>
            assetAccounts
              ?.find(
                assetAccount => assetAccount.id === vault.wallet.key.publicKey
              )
              ?.balances.some(
                balance =>
                  balance.asset_code === asset.code &&
                  balance.asset_issuer === asset.issuer.key.publicKey
              )
          )
          .map(vault => ({
            ...vault,
            isUnauthorized:
              assetAccounts
                ?.find(
                  assetAccount => assetAccount.id === vault.wallet.key.publicKey
                )
                ?.balances.find(
                  balance =>
                    balance.asset_code === asset.code &&
                    balance.asset_issuer === asset.issuer.key.publicKey
                )?.is_authorized === false || false,
          })) || []
      setVaults(filteredVaults)
    },
    [getAssetAccounts, getVaults]
  )

  useEffect(() => {
    if (id) {
      getAssetById(id).then(asset => {
        setAsset(asset)
        filterVaults(asset)
      })
    }
  }, [filterVaults, getAssetById, id])

  useEffect(() => {
    getUserPermissions().then((): void => {
      if (
        !loadingUserPermissions &&
        !havePermission(Permissions.DISTRIBUTE_ASSET, userPermissions)
      ) {
        navigate(PathRoute.HOME)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Flex>
      <Sidebar highlightMenu={PathRoute.TOKEN_MANAGEMENT}>
        <Flex flexDir="row" w="full" justifyContent="center" gap="1.5rem">
          <Flex maxW="966px" flexDir="column" w="full">
            <ManagementBreadcrumb title={'Distribute'} />
            {(loadingAsset && !asset) || !asset ? (
              <Skeleton h="15rem" />
            ) : (
              <DistributeAssetTemplate
                onSubmit={onSubmit}
                loading={loadingOperation}
                asset={asset}
                vaults={vaults}
                assetData={asset.assetData}
              />
            )}
          </Flex>
          <VStack>
            {(userPermissions || !loadingUserPermissions) && (
              <MenuActionsAsset
                action={AssetActions.DISTRIBUTE}
                permissions={userPermissions}
              />
            )}
            <ActionHelper
              title={'About Distribute'}
              description={distributeHelper}
            />
          </VStack>
        </Flex>
      </Sidebar>
    </Flex>
  )
}
