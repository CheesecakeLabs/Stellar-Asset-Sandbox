import { Flex, Skeleton, useToast, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { FieldValues, UseFormSetValue } from 'react-hook-form'
import { useParams } from 'react-router-dom'

import { useAssets } from 'hooks/useAssets'
import { useDashboards } from 'hooks/useDashboards'
import { burnHelper } from 'utils/constants/helpers'
import { MessagesError } from 'utils/constants/messages-error'

import { AssetActions } from 'components/enums/asset-actions'
import { PathRoute } from 'components/enums/path-route'
import { ActionHelper } from 'components/molecules/action-helper'
import { TChartPeriod } from 'components/molecules/chart-period'
import { ManagementBreadcrumb } from 'components/molecules/management-breadcrumb'
import { MenuActionsAsset } from 'components/organisms/menu-actions-asset'
import { Sidebar } from 'components/organisms/sidebar'
import { BurnAssetTemplate } from 'components/templates/burn-asset'

export const BurnAsset: React.FC = () => {
  const [asset, setAsset] = useState<Hooks.UseAssetsTypes.IAssetDto>()
  const [mintOperations, setMintOperations] =
    useState<Hooks.UseDashboardsTypes.IAsset>()
  const [burnOperations, setBurnOperations] =
    useState<Hooks.UseDashboardsTypes.IAsset>()
  const [chartPeriod, setChartPeriod] = useState<TChartPeriod>('24h')

  const { burn, getAssetById, loadingOperation, loadingAsset } = useAssets()
  const { loadingChart, getPaymentsByAssetId } = useDashboards()
  const { id } = useParams()
  const toast = useToast()

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
        amount: data.amount,
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
    <Flex>
      <Sidebar highlightMenu={PathRoute.HOME}>
        <Flex flexDir="row" w="full" justifyContent="center" gap="1.5rem">
          <Flex maxW="966px" flexDir="column" w="full">
            <ManagementBreadcrumb title={'Burn'} />
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
            <MenuActionsAsset action={AssetActions.BURN} />
            <ActionHelper title={'About Burn'} description={burnHelper} />
          </VStack>
        </Flex>
      </Sidebar>
    </Flex>
  )
}
