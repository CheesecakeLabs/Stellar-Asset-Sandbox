import { Box, Flex, Text } from '@chakra-ui/react'
import React from 'react'

import { AssetsList } from './components/assets-list'
import { ChartPayments } from './components/chart-payments'

interface IDashboardsTemplate {
  loading: boolean
  vaults: Hooks.UseVaultsTypes.IVault[] | undefined
  vaultCategories: Hooks.UseVaultsTypes.IVaultCategory[] | undefined
  loadingChart: boolean
  paymentsAssets: Hooks.UseDashboardsTypes.IAsset[] | undefined
}

export const DashboardsTemplate: React.FC<IDashboardsTemplate> = ({
  loadingChart,
  paymentsAssets,
}) => {
  return (
    <Flex flexDir="column" w="full">
      <Flex maxW="1024px" alignSelf="center" flexDir="column" w="full">
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
          <AssetsList />
        </Flex>
      </Flex>
    </Flex>
  )
}
