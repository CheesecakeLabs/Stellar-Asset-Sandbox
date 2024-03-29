import {
  Flex,
  Skeleton,
  useMediaQuery,
  useToast,
  VStack,
} from '@chakra-ui/react'
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { FieldValues, UseFormSetValue } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'

import { useAssets } from 'hooks/useAssets'
import { useAuth } from 'hooks/useAuth'
import { useHorizon } from 'hooks/useHorizon'
import { useVaults } from 'hooks/useVaults'
import { havePermission } from 'utils'
import { authorizeHelper } from 'utils/constants/helpers'
import { MessagesError } from 'utils/constants/messages-error'
import { GAService } from 'utils/ga'

import { AssetActions } from 'components/enums/asset-actions'
import { PathRoute } from 'components/enums/path-route'
import { Permissions } from 'components/enums/permissions'
import { ActionHelper } from 'components/molecules/action-helper'
import { ManagementBreadcrumb } from 'components/molecules/management-breadcrumb'
import { MenuActionsAsset } from 'components/organisms/menu-actions-asset'
import { MenuActionsAssetMobile } from 'components/organisms/menu-actions-asset-mobile'
import { Sidebar } from 'components/organisms/sidebar'
import { AuthorizeAccountTemplate } from 'components/templates/authorize-account'

export const AuthorizeAccount: React.FC = () => {
  const [asset, setAsset] = useState<Hooks.UseAssetsTypes.IAssetDto>()
  const [vaultsStatusList, setVaultsStatusList] =
    useState<Hooks.UseVaultsTypes.IVaultAccountName[]>()
  const [vaultsUnauthorized, setVaultsUnauthorized] =
    useState<Hooks.UseVaultsTypes.IVault[]>()
  const [isLargerThanMd] = useMediaQuery('(min-width: 768px)')
  const [isSmallerThanMd] = useMediaQuery('(max-width: 768px)')

  const { authorize, getAssetById, loadingOperation, loadingAsset } =
    useAssets()
  const { id } = useParams()
  const { getVaults, vaultsToStatusName, filterVaultsByStatus } = useVaults()
  const { loadingUserPermissions, userPermissions, getUserPermissions } =
    useAuth()
  const { getAssetAccounts } = useHorizon()

  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    GAService.GAPageView('Authorize Account')
  }, [])

  const onSubmit = async (
    data: FieldValues,
    setValue: UseFormSetValue<FieldValues>,
    wallet: string | undefined,
    setWallet: Dispatch<SetStateAction<string | undefined>>
  ): Promise<void> => {
    if (!asset || !id) return

    try {
      const isSuccess = await authorize({
        trustor_pk: wallet ? wallet : data.wallet,
        issuer: asset.issuer.id,
        code: asset.code,
        set_flags: ['TRUST_LINE_AUTHORIZED'],
      })

      if (isSuccess) {
        setValue('wallet', '')
        setWallet(undefined)
        toast({
          title: 'Authorize success!',
          description: `You authorized the account`,
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
      title: 'Authorize error!',
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
      const vaults = await getVaults(true)
      const vaultsStatusList = vaultsToStatusName(vaults, assetAccounts, asset)
      const vaultsUnauthorized = filterVaultsByStatus(
        vaults,
        assetAccounts,
        asset,
        false
      )
      setVaultsStatusList(vaultsStatusList)
      setVaultsUnauthorized(vaultsUnauthorized)
    },
    [filterVaultsByStatus, getAssetAccounts, getVaults, vaultsToStatusName]
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
    getVaults(true)
  }, [getVaults])

  useEffect(() => {
    getUserPermissions().then((): void => {
      if (
        !loadingUserPermissions &&
        !havePermission(Permissions.AUTHORIZE_ASSET, userPermissions)
      ) {
        navigate(PathRoute.HOME)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Flex pb="3.5rem">
      <Sidebar highlightMenu={PathRoute.TOKEN_MANAGEMENT}>
        <Flex
          flexDir={{ base: 'column-reverse', md: 'row' }}
          w="full"
          justifyContent="center"
          gap="1.5rem"
        >
          {isSmallerThanMd && (
            <ActionHelper
              title={'About Authorize'}
              description={authorizeHelper}
            />
          )}
          <Flex maxW="966px" flexDir="column" w="full">
            <ManagementBreadcrumb title={'Authorize'} />
            {id && isSmallerThanMd && (
              <MenuActionsAssetMobile id={id} selected={'AUTHORIZE'} />
            )}
            {(loadingAsset && !asset) || !asset ? (
              <Skeleton h="15rem" />
            ) : (
              <AuthorizeAccountTemplate
                onSubmit={onSubmit}
                loading={loadingOperation}
                asset={asset}
                vaultsUnauthorized={vaultsUnauthorized}
                vaultsStatusList={vaultsStatusList}
              />
            )}
          </Flex>
          <VStack>
            {(userPermissions || !loadingUserPermissions) && isLargerThanMd && (
              <MenuActionsAsset
                action={AssetActions.AUTHORIZE}
                permissions={userPermissions}
              />
            )}
            {isLargerThanMd && (
              <ActionHelper
                title={'About Authorize'}
                description={authorizeHelper}
              />
            )}
          </VStack>
        </Flex>
      </Sidebar>
    </Flex>
  )
}
