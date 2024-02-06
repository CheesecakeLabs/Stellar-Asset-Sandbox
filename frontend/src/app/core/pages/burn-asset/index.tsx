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
import { useDashboards } from 'hooks/useDashboards'
import { havePermission } from 'utils'
import { burnHelper } from 'utils/constants/helpers'
import { MessagesError } from 'utils/constants/messages-error'
import { toFixedCrypto } from 'utils/formatter'
import { GAService } from 'utils/ga'

import { AssetActions } from 'components/enums/asset-actions'
import { PathRoute } from 'components/enums/path-route'
import { Permissions } from 'components/enums/permissions'
import { ActionHelper } from 'components/molecules/action-helper'
import { TChartPeriod } from 'components/molecules/chart-period'
import { ManagementBreadcrumb } from 'components/molecules/management-breadcrumb'
import { MenuActionsAsset } from 'components/organisms/menu-actions-asset'
import { MenuActionsAssetMobile } from 'components/organisms/menu-actions-asset-mobile'
import { Sidebar } from 'components/organisms/sidebar'
import { BurnAssetTemplate } from 'components/templates/burn-asset'

export const BurnAsset: React.FC = () => {
  const [asset, setAsset] = useState<Hooks.UseAssetsTypes.IAssetDto>()
  const [mintOperations, setMintOperations] =
    useState<Hooks.UseDashboardsTypes.IAsset>()
  const [burnOperations, setBurnOperations] =
    useState<Hooks.UseDashboardsTypes.IAsset>()
  const [chartPeriod, setChartPeriod] = useState<TChartPeriod>('24h')
  const [isLargerThanMd] = useMediaQuery('(min-width: 768px)')
  const [isSmallerThanMd] = useMediaQuery('(max-width: 768px)')

  const { burn, getAssetById, loadingOperation, loadingAsset } = useAssets()
  const { loadingUserPermissions, userPermissions, getUserPermissions } =
    useAuth()
  const { loadingChart, getPaymentsByAssetId } = useDashboards()
  const { id } = useParams()
  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    GAService.GAPageView('Burn Asset')
  }, [])

  const onSubmit = async (
    data: FieldValues,
    setValue: UseFormSetValue<FieldValues>
  ): Promise<void> => {
    if (!asset || !id) return

    try {
      const isSuccess = await burn({
        id: asset.id.toString(),
        code: asset.code,
        sponsor_id: 1,
        amount: toFixedCrypto(data.amount),
        current_supply: Number(asset.assetData?.amount || 0) - data.amount,
        current_main_vault: Number(asset.distributorBalance?.balance || 0),
      })

      if (isSuccess) {
        setValue('amount', '')
        toast({
          title: 'Burn success!',
          description: `You burned ${data.amount} ${asset.code}`,
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: 'top-right',
        })
        getAssetById(id).then(asset => setAsset(asset))
        getPaymentsByAssetId(id, 2, chartPeriod).then(paymentsAsset => {
          setMintOperations(paymentsAsset)
        })
        getPaymentsByAssetId(id, 5, chartPeriod).then(paymentsAsset => {
          setBurnOperations(paymentsAsset)
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

  useEffect(() => {
    if (id) {
      getAssetById(id).then(asset => setAsset(asset))
    }
  }, [getAssetById, id])

  useEffect(() => {
    if (id) {
      getPaymentsByAssetId(id, 2, chartPeriod).then(paymentsAsset => {
        setMintOperations(paymentsAsset)
      })
    }
  }, [chartPeriod, getPaymentsByAssetId, id])

  useEffect(() => {
    if (id) {
      getPaymentsByAssetId(id, 5, chartPeriod).then(paymentsAsset => {
        setBurnOperations(paymentsAsset)
      })
    }
  }, [chartPeriod, getPaymentsByAssetId, id])

  useEffect(() => {
    getUserPermissions().then((): void => {
      if (
        !loadingUserPermissions &&
        !havePermission(Permissions.BURN_ASSET, userPermissions)
      ) {
        navigate(PathRoute.HOME)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toastError = (message: string): void => {
    toast({
      title: 'Burn error!',
      description: message,
      status: 'error',
      duration: 9000,
      isClosable: true,
      position: 'top-right',
    })
  }

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
            <ActionHelper title={'About Burn'} description={burnHelper} />
          )}
          <Flex maxW="966px" flexDir="column" w="full">
            <ManagementBreadcrumb title={'Burn'} />
            {id && isSmallerThanMd && (
              <MenuActionsAssetMobile id={id} selected={'BURN'} />
            )}
            {(loadingAsset && !asset) || !asset ? (
              <Skeleton h="15rem" />
            ) : (
              <BurnAssetTemplate
                onSubmit={onSubmit}
                setChartPeriod={setChartPeriod}
                loading={loadingOperation}
                asset={asset}
                assetData={asset.assetData}
                mintOperations={mintOperations}
                burnOperations={burnOperations}
                loadingChart={loadingChart}
                chartPeriod={chartPeriod}
              />
            )}
          </Flex>
          <VStack>
            {(userPermissions || !loadingUserPermissions) && isLargerThanMd && (
              <MenuActionsAsset
                action={AssetActions.BURN}
                permissions={userPermissions}
              />
            )}
            {isLargerThanMd && (
              <ActionHelper title={'About Burn'} description={burnHelper} />
            )}
          </VStack>
        </Flex>
      </Sidebar>
    </Flex>
  )
}
