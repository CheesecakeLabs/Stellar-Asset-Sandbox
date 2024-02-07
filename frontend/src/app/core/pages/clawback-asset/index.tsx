import {
  Flex,
  Skeleton,
  useMediaQuery,
  useToast,
  VStack,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { FieldValues, UseFormSetValue } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'

import { useAssets } from 'hooks/useAssets'
import { useAuth } from 'hooks/useAuth'
import { useHorizon } from 'hooks/useHorizon'
import { useVaults } from 'hooks/useVaults'
import { havePermission } from 'utils'
import { clawbackHelper } from 'utils/constants/helpers'
import { MessagesError } from 'utils/constants/messages-error'
import { toFixedCrypto } from 'utils/formatter'
import { GAService } from 'utils/ga'

import { AssetActions } from 'components/enums/asset-actions'
import { PathRoute } from 'components/enums/path-route'
import { Permissions } from 'components/enums/permissions'
import { ActionHelper } from 'components/molecules/action-helper'
import { ManagementBreadcrumb } from 'components/molecules/management-breadcrumb'
import { MenuActionsAsset } from 'components/organisms/menu-actions-asset'
import { MenuActionsAssetMobile } from 'components/organisms/menu-actions-asset-mobile'
import { Sidebar } from 'components/organisms/sidebar'
import { ClawbackAssetTemplate } from 'components/templates/clawback-asset'

export const ClawbackAsset: React.FC = () => {
  const [asset, setAsset] = useState<Hooks.UseAssetsTypes.IAssetDto>()
  const [isLargerThanMd] = useMediaQuery('(min-width: 768px)')
  const [isSmallerThanMd] = useMediaQuery('(max-width: 768px)')
  const [vaults, setVaults] = useState<
    Hooks.UseVaultsTypes.IVault[] | undefined
  >([])
  const [wallet, setWallet] = useState<string | undefined>()
  const [walletBalance, setWalletBalance] = useState<string | undefined>()

  const { clawback, getAssetById, loadingOperation, loadingAsset } = useAssets()
  const { loadingUserPermissions, userPermissions, getUserPermissions } =
    useAuth()
  const { id } = useParams()
  const { getVaults } = useVaults()
  const { getAccountData } = useHorizon()
  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    GAService.GAPageView('Clawback Asset')
  }, [])

  const onSubmit = async (
    data: FieldValues,
    setValue: UseFormSetValue<FieldValues>,
    wallet: string | undefined
  ): Promise<void> => {
    if (!asset || !id) return
    try {
      const isSuccess = await clawback({
        sponsor_id: 1,
        amount: toFixedCrypto(data.amount),
        code: asset.code,
        from: wallet ? wallet : data.from,
        current_supply: Number(asset.assetData?.amount || 0) - data.amount,
        current_main_vault: Number(asset.distributorBalance?.balance || 0),
      })

      if (isSuccess) {
        setValue('from', '')
        setValue('amount', '')

        toast({
          title: 'Clawback success!',
          description: `You Clawbacked ${data.amount} ${asset.code} from ${data.from}`,
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: 'top-right',
        })
        return
      }
      getAssetById(id).then(asset => setAsset(asset))

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
      title: 'Clawback error!',
      description: message,
      status: 'error',
      duration: 9000,
      isClosable: true,
      position: 'top-right',
    })
  }

  useEffect(() => {
    if (asset) {
      getVaults(true).then(
        (result: Hooks.UseVaultsTypes.IVault[] | undefined) => {
          setVaults(
            result?.filter(vaultsData =>
              vaultsData.accountData?.balances.find(
                balance =>
                  balance.asset_code === asset?.code &&
                  balance.asset_issuer === asset?.issuer.key.publicKey
              )
            ) || []
          )
        }
      )
    }
  }, [getVaults, asset])

  useEffect(() => {
    if (id) {
      getAssetById(id).then(asset => setAsset(asset))
    }
  }, [getAssetById, id])

  useEffect(() => {
    getUserPermissions().then((): void => {
      if (
        !loadingUserPermissions &&
        !havePermission(Permissions.CLAWBACK_ASSET, userPermissions)
      ) {
        navigate(PathRoute.HOME)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (wallet) {
      getAccountData(wallet).then(accountData => {
        const balance = accountData?.balances.find(
          balance =>
            balance.asset_code === asset?.code &&
            balance.asset_issuer === asset?.issuer.key.publicKey
        )?.balance

        setWalletBalance(balance)
      })
    }
  }, [wallet, asset?.code, asset?.issuer.key.publicKey, getAccountData])

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
              title={'About Clawback'}
              description={clawbackHelper}
            />
          )}
          <Flex maxW="966px" flexDir="column" w="full">
            <ManagementBreadcrumb title={'Clawback'} />
            {id && isSmallerThanMd && (
              <MenuActionsAssetMobile id={id} selected={'CLAWBACK'} />
            )}
            {loadingAsset || !asset ? (
              <Skeleton h="15rem" />
            ) : (
              <ClawbackAssetTemplate
                onSubmit={onSubmit}
                setWallet={setWallet}
                loading={loadingOperation}
                asset={asset}
                vaults={vaults}
                assetData={asset.assetData}
                wallet={wallet}
                walletBalance={walletBalance}
              />
            )}
          </Flex>
          <VStack>
            {(userPermissions || !loadingUserPermissions) && isLargerThanMd && (
              <MenuActionsAsset
                action={AssetActions.CLAWBACK}
                permissions={userPermissions}
              />
            )}
            {isLargerThanMd && (
              <ActionHelper
                title={'About Clawback'}
                description={clawbackHelper}
              />
            )}
          </VStack>
        </Flex>
      </Sidebar>
    </Flex>
  )
}
