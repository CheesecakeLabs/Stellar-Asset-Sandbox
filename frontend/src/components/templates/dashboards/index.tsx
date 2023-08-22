import { Box, Flex, Text } from '@chakra-ui/react'
import React from 'react'

import { MAX_PAGE_WIDTH } from 'utils/constants/sizes'

import { AssetsList } from './components/assets-list'
import { ChartPayments } from './components/chart-payments'

interface IDashboardsTemplate {
  loading: boolean
  vaults: Hooks.UseVaultsTypes.IVault[] | undefined
  vaultCategories: Hooks.UseVaultsTypes.IVaultCategory[] | undefined
  loadingChart: boolean
  paymentsAssets: Hooks.UseDashboardsTypes.IAsset[] | undefined
  assets: Hooks.UseAssetsTypes.IAssetDto[] | undefined
  loadingAssets: boolean
}

export const DashboardsTemplate: React.FC<IDashboardsTemplate> = ({
  loadingChart,
  paymentsAssets,
  assets,
  loadingAssets,
}) => {
  return (
    <Flex flexDir="column" w="full">
      <Flex maxW={MAX_PAGE_WIDTH} alignSelf="center" flexDir="column" w="full">
        <Flex>
          <Text fontSize="2xl" fontWeight="400">
            Dashboards
          </Text>
        </Flex>
        <Flex>
          <Box w="full" mr="1rem">
            {paymentsAssets && (
              <ChartPayments
                loadingChart={loadingChart}
                paymentsAssets={paymentsAssets}
              />
            )}
          </Box>
          <AssetsList assets={assets} loadingAssets={loadingAssets} />
        </Flex>
      </Flex>
    </Flex>
  )
}
