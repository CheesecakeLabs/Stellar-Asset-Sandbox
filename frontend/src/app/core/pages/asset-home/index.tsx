import { Flex, Skeleton, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useAssets } from 'hooks/useAssets'
import { useDashboards } from 'hooks/useDashboards'
import { assetHomeHelper } from 'utils/constants/helpers'

import { AssetActions } from 'components/enums/asset-actions'
import { PathRoute } from 'components/enums/path-route'
import { ActionHelper } from 'components/molecules/action-helper'
import { ManagementBreadcrumb } from 'components/molecules/management-breadcrumb'
import { MenuActionsAsset } from 'components/organisms/menu-actions-asset'
import { Sidebar } from 'components/organisms/sidebar'
import { AssetHomeTemplate } from 'components/templates/asset-home'

export const AssetHome: React.FC = () => {
  const [asset, setAsset] = useState<Hooks.UseAssetsTypes.IAssetDto>()
  const [paymentsAsset, setPaymentsAsset] =
    useState<Hooks.UseDashboardsTypes.IAsset>()
  const { loadingAsset, getAssetById } = useAssets()
  const { getPaymentsByAssetId, loadingChart } = useDashboards()
  const { id } = useParams()

  useEffect(() => {
    if (id) {
      getAssetById(id).then(asset => setAsset(asset))
    }
  }, [getAssetById, id])

  useEffect(() => {
    if (id) {
      getPaymentsByAssetId(id).then(paymentsAsset =>
        setPaymentsAsset(paymentsAsset)
      )
    }
  }, [getPaymentsByAssetId, id])

  return (
    <Flex>
      <Sidebar highlightMenu={PathRoute.HOME}>
        <Flex flexDir="row" w="full" justifyContent="center" gap="1.5rem">
          <Flex maxW="966px" flexDir="column" w="full">
            <ManagementBreadcrumb title={'Mint'} />
            {loadingAsset || !asset ? (
              <Skeleton h="15rem" />
            ) : (
              <AssetHomeTemplate
                loading={loadingAsset}
                asset={asset}
                loadingChart={loadingChart}
                paymentsAsset={paymentsAsset}
              />
            )}
          </Flex>
          <VStack>
            <MenuActionsAsset action={AssetActions.HOME} />
            <ActionHelper
              title={'About Assets'}
              description={assetHomeHelper}
            />
          </VStack>
        </Flex>
      </Sidebar>
    </Flex>
  )
}
