import { Flex, Text } from '@chakra-ui/react'
import React, { Dispatch, SetStateAction, useState } from 'react'

import { AssetsList } from './components/assets-list'
import { ChartPayments } from './components/chart-payments'
import { LastPayments } from './components/last-payments'
import { TChartPeriod } from 'components/molecules/chart-period'

interface IDashboardsTemplate {
  loading: boolean
  vaults: Hooks.UseVaultsTypes.IVault[] | undefined
  vaultCategories: Hooks.UseVaultsTypes.IVaultCategory[] | undefined
  loadingChart: boolean
  paymentsAssets: Hooks.UseDashboardsTypes.IAsset[] | undefined
  assets: Hooks.UseAssetsTypes.IAssetDto[] | undefined
  loadingAssets: boolean
  chartPeriod: TChartPeriod
  transactions: Hooks.UseDashboardsTypes.ITransaction[] | undefined
  loadingLastTransactions: boolean
  setChartPeriod: Dispatch<SetStateAction<TChartPeriod>>
}

export const DashboardsTemplate: React.FC<IDashboardsTemplate> = ({
  loadingChart,
  paymentsAssets,
  assets,
  loadingAssets,
  chartPeriod,
  transactions,
  loadingLastTransactions,
  vaults,
  setChartPeriod,
}) => {
  const [assetSelected, setAssetSelected] =
    useState<Hooks.UseAssetsTypes.IAssetDto>()

  return (
    <Flex flexDir="column" w="full" pb="3.5rem">
      <Flex maxW="1580px" alignSelf="center" flexDir="column" w="full">
        <Flex>
          <Text fontSize="2xl" fontWeight="400">
            Dashboards
          </Text>
        </Flex>
        <Flex flexDir="column" mt="1rem">
          <AssetsList
            assets={assets}
            loadingAssets={loadingAssets}
            assetSelected={assetSelected}
            setAssetSelected={setAssetSelected}
          />
          {!assetSelected && (
            <>
              <Flex w="full" gap="1rem">
                <ChartPayments
                  loadingChart={loadingChart}
                  paymentsAssets={paymentsAssets}
                  chartPeriod={chartPeriod}
                  setChartPeriod={setChartPeriod}
                />
              </Flex>
              <LastPayments
                transactions={transactions}
                loading={loadingLastTransactions}
                assets={assets}
                vaults={vaults}
              />
            </>
          )}
        </Flex>
      </Flex>
    </Flex>
  )
}
