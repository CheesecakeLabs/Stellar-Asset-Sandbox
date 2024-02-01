import {
  Flex,
  Skeleton,
  VStack,
  useMediaQuery,
  useToast,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useAssets } from 'hooks/useAssets'
import { useAuth } from 'hooks/useAuth'
import { useDashboards } from 'hooks/useDashboards'
import { assetHomeHelper } from 'utils/constants/helpers'
import { MessagesError } from 'utils/constants/messages-error'
import { toBase64 } from 'utils/converter'
import { GAService } from 'utils/ga'

import { AssetActions } from 'components/enums/asset-actions'
import { PathRoute } from 'components/enums/path-route'
import { ActionHelper } from 'components/molecules/action-helper'
import { TChartPeriod } from 'components/molecules/chart-period'
import { ManagementBreadcrumb } from 'components/molecules/management-breadcrumb'
import { MenuActionsAsset } from 'components/organisms/menu-actions-asset'
import { MenuActionsAssetMobile } from 'components/organisms/menu-actions-asset-mobile'
import { Sidebar } from 'components/organisms/sidebar'
import { AssetHomeTemplate } from 'components/templates/asset-home'

export const AssetHome: React.FC = () => {
  const [asset, setAsset] = useState<Hooks.UseAssetsTypes.IAssetDto>()
  const [paymentsAsset, setPaymentsAsset] =
    useState<Hooks.UseDashboardsTypes.IAsset>()
  const [chartPeriod, setChartPeriod] = useState<TChartPeriod>('24h')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLargerThanMd] = useMediaQuery('(min-width: 768px)')
  const [isSmallerThanMd] = useMediaQuery('(max-width: 768px)')

  const { loadingAsset, getAssetById, updateImage } = useAssets()
  const { loadingUserPermissions, userPermissions, getUserPermissions } =
    useAuth()
  const { getPaymentsByAssetId, loadingChart } = useDashboards()
  const { id } = useParams()

  const toast = useToast()

  useEffect(() => {
    GAService.GAPageView('Asset Home')
  }, [])

  useEffect(() => {
    if (id) {
      getAssetById(id).then(asset => setAsset(asset))
    }
  }, [getAssetById, id])

  useEffect(() => {
    if (id) {
      getPaymentsByAssetId(id, 0, chartPeriod).then(paymentsAsset =>
        setPaymentsAsset(paymentsAsset)
      )
    }
  }, [chartPeriod, getPaymentsByAssetId, id])

  useEffect(() => {
    getUserPermissions()
  }, [getUserPermissions])

  const handleUploadImage = async (): Promise<boolean> => {
    if (!asset || !selectedFile) return false

    try {
      const image = await toBase64(selectedFile)
      const isSuccess = await updateImage(asset?.id, image)

      if (isSuccess) {
        if (id) {
          getAssetById(id).then(asset => setAsset(asset))
        }
        return true
      }

      toastError(MessagesError.errorOccurred)
    } catch (error) {
      let message
      if (error instanceof Error) message = error.message
      else message = String(error)
      toastError(message)
    }

    return false
  }

  const toastError = (message: string): void => {
    toast({
      title: 'Update logo error!',
      description: message,
      status: 'error',
      duration: 9000,
      isClosable: true,
      position: 'top-right',
    })
  }

  return (
    <Flex>
      <Sidebar highlightMenu={PathRoute.TOKEN_MANAGEMENT}>
        <Flex
          flexDir={{ base: 'column-reverse', md: 'row' }}
          w="full"
          justifyContent="center"
          gap="1.5rem"
        >
          {isSmallerThanMd && (
            <ActionHelper
              title={'About Assets'}
              description={assetHomeHelper}
            />
          )}
          <Flex maxW="966px" flexDir="column" w="full">
            <Flex justifyContent="space-between" w="full" alignItems="center">
              <ManagementBreadcrumb title={'Asset home'} />
              {id && isSmallerThanMd && (
                <MenuActionsAssetMobile id={id} selected={'HOME'} />
              )}
            </Flex>
            {loadingAsset || !asset ? (
              <Skeleton h="15rem" />
            ) : (
              <AssetHomeTemplate
                loading={loadingAsset}
                asset={asset}
                loadingChart={loadingChart}
                paymentsAsset={paymentsAsset}
                chartPeriod={chartPeriod}
                permissions={userPermissions}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                setChartPeriod={setChartPeriod}
                handleUploadImage={handleUploadImage}
              />
            )}
          </Flex>
          <VStack>
            {(userPermissions || !loadingUserPermissions) && isLargerThanMd && (
              <MenuActionsAsset
                action={AssetActions.HOME}
                permissions={userPermissions}
              />
            )}
            {isLargerThanMd && (
              <ActionHelper
                title={'About Assets'}
                description={assetHomeHelper}
              />
            )}
          </VStack>
        </Flex>
      </Sidebar>
    </Flex>
  )
}
