import { Flex, Skeleton, useToast, VStack } from '@chakra-ui/react'
import React, { useCallback, useEffect, useState } from 'react'
import { FieldValues, UseFormSetValue } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'

import { useAssets } from 'hooks/useAssets'
import { useAuth } from 'hooks/useAuth'
import { useHorizon } from 'hooks/useHorizon'
import { useVaults } from 'hooks/useVaults'
import { havePermission } from 'utils'
import { freezeHelper } from 'utils/constants/helpers'
import { MessagesError } from 'utils/constants/messages-error'

import { AssetActions } from 'components/enums/asset-actions'
import { PathRoute } from 'components/enums/path-route'
import { Permissions } from 'components/enums/permissions'
import { ActionHelper } from 'components/molecules/action-helper'
import { ManagementBreadcrumb } from 'components/molecules/management-breadcrumb'
import { MenuActionsAsset } from 'components/organisms/menu-actions-asset'
import { Sidebar } from 'components/organisms/sidebar'
import { FreezeAccountTemplate } from 'components/templates/freeze-account'

export const FreezeAccount: React.FC = () => {
  const [asset, setAsset] = useState<Hooks.UseAssetsTypes.IAssetDto>()
  const [vaultsAuthorized, setVaultsAuthorized] =
    useState<Hooks.UseVaultsTypes.IVault[]>()
  const [vaultsUnauthorized, setVaultsUnauthorized] =
    useState<Hooks.UseVaultsTypes.IVault[]>()

  const { updateAuthFlags, getAssetById, loadingOperation, loadingAsset } =
    useAssets()
  const { loadingUserPermissions, userPermissions, getUserPermissions } =
    useAuth()
  const { id } = useParams()
  const { vaults, getVaults } = useVaults()
  const { getAssetAccounts } = useHorizon()

  const toast = useToast()
  const navigate = useNavigate()

  const onSubmit = async (
    data: FieldValues,
    clearFlags: string[],
    setFlags: string[],
    setValue: UseFormSetValue<FieldValues>,
    wallet: string | undefined
  ): Promise<void> => {
    if (!asset || !id) return

    try {
      const isSuccess = await updateAuthFlags({
        trustor_pk: wallet ? wallet : data.trustor_pk,
        issuer: asset.issuer.id,
        code: asset.code,
        clear_flags: clearFlags,
        set_flags: setFlags,
      })

      if (isSuccess) {
        setValue('trustor_id', '')

        toast({
          title: 'Success!',
          description: `You ${
            clearFlags.length > 0 ? 'freezed' : 'unfreezed'
          } ${data.trustor_pk}`,
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
      title: 'Error!',
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
      const vaultsUnauthorized =
        vaults?.filter((vault: Hooks.UseVaultsTypes.IVault) =>
          assetAccounts
            ?.find(
              assetAccount => assetAccount.id === vault.wallet.key.publicKey
            )
            ?.balances.some(
              balance =>
                balance.asset_code === asset.code &&
                balance.asset_issuer === asset.issuer.key.publicKey &&
                balance.is_authorized === false
            )
        ) || []
      const vaultsAuthorized = vaults?.filter(
        vault =>
          !vaultsUnauthorized.some(
            vaultUnauthorized => vaultUnauthorized.id === vault.id
          )
      )
      setVaultsAuthorized(vaultsAuthorized)
      setVaultsUnauthorized(vaultsUnauthorized)
    },
    [getAssetAccounts, getVaults]
  )

  useEffect(() => {
    getVaults()
  }, [getVaults])

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
        !havePermission(Permissions.FREEZE_ACCOUNT, userPermissions)
      ) {
        navigate(PathRoute.HOME)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Flex>
      <Sidebar highlightMenu={PathRoute.HOME}>
        <Flex flexDir="row" w="full" justifyContent="center" gap="1.5rem">
          <Flex maxW="966px" flexDir="column" w="full">
            <ManagementBreadcrumb title={'Freeze'} />
            {(loadingAsset && !asset) || !asset ? (
              <Skeleton h="15rem" />
            ) : (
              <FreezeAccountTemplate
                onSubmit={onSubmit}
                loading={loadingOperation}
                asset={asset}
                vaults={vaults}
                vaultsAuthorized={vaultsAuthorized}
                vaultsUnauthorized={vaultsUnauthorized}
              />
            )}
          </Flex>
          <VStack>
            {(userPermissions || !loadingUserPermissions) && (
              <MenuActionsAsset
                action={AssetActions.FREEZE}
                permissions={userPermissions}
              />
            )}
            <ActionHelper title={'About Freeze'} description={freezeHelper} />
          </VStack>
        </Flex>
      </Sidebar>
    </Flex>
  )
}
