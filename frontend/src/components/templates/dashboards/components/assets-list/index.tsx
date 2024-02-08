import { Text, Container, Flex, Divider, useMediaQuery } from '@chakra-ui/react'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'

import { useAssets } from 'hooks/useAssets'
import { useDashboards } from 'hooks/useDashboards'
import { useHorizon } from 'hooks/useHorizon'
import { useVaults } from 'hooks/useVaults'
import { formatAccount } from 'utils/formatter'

import { AccountsChart } from 'components/molecules/accounts-chart'
import { ChartPayments } from 'components/molecules/chart-payments'
import { TChartPeriod } from 'components/molecules/chart-period'
import { BalanceChart } from 'components/templates/distribute-asset/components/balance-chart'

import { AssetItem } from '../asset-item'
import { ChartHolders } from '../chart-holders'
import { ChartSupply } from '../chart-supply'
import { TopHolders } from '../top-holders'

interface IAssetsList {
  assets: Hooks.UseAssetsTypes.IAssetDto[] | undefined
  loadingAssets: boolean
  assetSelected: Hooks.UseAssetsTypes.IAssetDto | undefined
  setAssetSelected: Dispatch<
    SetStateAction<Hooks.UseAssetsTypes.IAssetDto | undefined>
  >
}

export const AssetsList: React.FC<IAssetsList> = ({
  assets,
  assetSelected,
  setAssetSelected,
}) => {
  const [isLargerThanMd] = useMediaQuery('(min-width: 768px)')
  const [paymentsAsset, setPaymentsAsset] =
    useState<Hooks.UseDashboardsTypes.IAsset>()
  const [supplyAsset, setSupplyAsset] =
    useState<Hooks.UseDashboardsTypes.ISupply>()
  const [chartPeriod, setChartPeriod] = useState<TChartPeriod>('24h')
  const [topHolders, setTopHolders] =
    useState<Hooks.UseHorizonTypes.IHolder[]>()
  const [groupedValues, setGroupedValues] = useState<number[]>([])
  const [divisorValues, setDivisorValues] = useState<number>(0)

  const { getPaymentsByAssetId, getSupplyByAssetId, loadingChart } =
    useDashboards()
  const { getAssetAccounts } = useHorizon()
  const { getVaults } = useVaults()
  const { getAssetById } = useAssets()

  useEffect(() => {
    if (assetSelected) {
      getPaymentsByAssetId(assetSelected.id.toString(), 0, chartPeriod).then(
        paymentsAsset => setPaymentsAsset(paymentsAsset)
      )
    }
  }, [assetSelected, chartPeriod, getPaymentsByAssetId])

  useEffect(() => {
    if (assetSelected) {
      getSupplyByAssetId(assetSelected.id.toString(), chartPeriod).then(
        supplyAsset => setSupplyAsset(supplyAsset)
      )
    }
  }, [assetSelected, chartPeriod, getSupplyByAssetId])

  useEffect(() => {
    if (assetSelected) {
      getAssetAccounts(
        assetSelected.code,
        assetSelected.issuer.key.publicKey
      ).then(async accounts => {
        const vaults = (await getVaults()) as
          | Hooks.UseVaultsTypes.IVault[]
          | undefined
        const filteredAccounts = accounts
          ?.filter(
            account => account.id !== assetSelected.distributor.key.publicKey
          )
          ?.sort(
            (a, b) =>
              Number(
                b.balances?.find(
                  balance =>
                    balance.asset_code === assetSelected.code &&
                    balance.asset_issuer === assetSelected.issuer.key.publicKey
                )?.balance || 0
              ) -
              Number(
                a.balances.find(
                  balance =>
                    balance.asset_code === assetSelected.code &&
                    balance.asset_issuer === assetSelected.issuer.key.publicKey
                )?.balance || 0
              )
          )
          .slice(0, 5)
          .map(account => ({
            name:
              vaults?.find(vault => vault.wallet.key.publicKey === account.id)
                ?.name || formatAccount(account.id),
            amount: Number(
              account.balances?.find(
                balance =>
                  balance.asset_code === assetSelected.code &&
                  balance.asset_issuer === assetSelected.issuer.key.publicKey
              )?.balance || 0
            ),
            percentage:
              (Number(
                account.balances?.find(
                  balance =>
                    balance.asset_code === assetSelected.code &&
                    balance.asset_issuer === assetSelected.issuer.key.publicKey
                )?.balance || 0
              ) /
                Number(assetSelected.assetData?.amount || 1)) *
              100,
          }))
        setTopHolders(filteredAccounts || [])

        const groupedValues = [0, 0, 0, 0, 0, 0, 0]
        const divisorValue =
          (filteredAccounts ? filteredAccounts[0]?.amount || 0 : 0) / 5

        accounts
          ?.filter(
            account => account.id !== assetSelected.distributor.key.publicKey
          )
          .forEach(account => {
            const amount = Number(
              account.balances?.find(
                balance =>
                  balance.asset_code === assetSelected.code &&
                  balance.asset_issuer === assetSelected.issuer.key.publicKey
              )?.balance || 0
            )
            if (amount < 1000) {
              groupedValues[0]++
            } else if (amount >= 1000 && amount < 10000) {
              groupedValues[1]++
            } else if (amount >= 10000 && amount < 100000) {
              groupedValues[2]++
            } else if (amount >= 100000 && amount < 1000000) {
              groupedValues[3]++
            } else if (amount >= 1000000 && amount < 10000000) {
              groupedValues[4]++
            } else if (amount >= 10000000 && amount < 100000000) {
              groupedValues[5]++
            } else {
              groupedValues[6]++
            }
          })

        setGroupedValues(groupedValues)
        setDivisorValues(divisorValue)
      })
    }
  }, [assetSelected, getAssetAccounts, getVaults])

  const onSelectAsset = (asset: Hooks.UseAssetsTypes.IAssetDto): void => {
    getAssetById(asset.id.toString()).then(asset => setAssetSelected(asset))
  }

  return (
    <Flex flexDir="column">
      <Flex overflowX="auto">
        {
          <Container
            variant="primary"
            w="fit-content"
            justifyContent="center"
            py="0.5rem"
            px="1.25rem"
            mr="0.5rem"
            cursor="pointer"
            bg={!assetSelected ? 'primary.normal' : undefined}
            onClick={(): void => {
              setAssetSelected(undefined)
            }}
            _hover={!assetSelected?.id ? undefined : { bg: 'purple.50' }}
            _dark={
              !assetSelected?.id
                ? { bg: 'primary.normal', border: 'none' }
                : undefined
            }
          >
            <Flex alignItems="center" h="full">
              <Flex flexDir="column" w="full" h="min-content">
                <Text
                  fontSize="sm"
                  fontWeight="700"
                  color={!assetSelected ? 'white' : undefined}
                >
                  All assets
                </Text>
              </Flex>
            </Flex>
          </Container>
        }
        {assets?.map(asset => (
          <AssetItem
            asset={asset}
            assetSelected={assetSelected}
            setAssetSelected={setAssetSelected}
            onSelectAsset={onSelectAsset}
          />
        ))}
      </Flex>

      {assetSelected && (
        <Flex flexDir="column">
          <Flex flexDir={isLargerThanMd ? 'row' : 'column'}>
            <Container
              variant="primary"
              justifyContent="center"
              p={0}
              cursor="pointer"
              maxW="full"
              mt="1rem"
              mr="1rem"
            >
              <Flex w="full">
                {paymentsAsset && (
                  <ChartPayments
                    loadingChart={loadingChart}
                    paymentsAsset={paymentsAsset}
                    chartPeriod={chartPeriod}
                    setChartPeriod={setChartPeriod}
                    cleanMode
                  />
                )}
              </Flex>
            </Container>

            <Container
              variant="primary"
              justifyContent="center"
              p="0.5rem"
              cursor="pointer"
              maxW={isLargerThanMd ? '340px' : 'full'}
              mt="1rem"
            >
              <Flex flexDir="column">
                <Text
                  fontSize="xs"
                  fontWeight="600"
                  mt="0.5rem"
                  ms="0.25rem"
                  mb="0.25rem"
                >
                  Accounts authorization
                </Text>
                <Flex justifyContent="center">
                  <AccountsChart
                    authorized={
                      assetSelected.assetData?.accounts.authorized || 0
                    }
                    unauthorized={
                      (assetSelected.assetData?.accounts
                        .authorized_to_maintain_liabilities || 0) +
                      (assetSelected.assetData?.accounts.unauthorized || 0)
                    }
                    authorizedLabel={'Authorized'}
                    unauthorizedLabel={'Pending authorization'}
                  />
                </Flex>
                <Divider mt="1rem" />
                <BalanceChart
                  supply={Number(assetSelected.assetData?.amount || 0)}
                  mainVault={Number(
                    assetSelected.distributorBalance?.balance || 0
                  )}
                  assetCode={assetSelected.code}
                  modeClean
                />
              </Flex>
            </Container>
          </Flex>

          <Flex flexDir={isLargerThanMd ? 'row' : 'column'}>
            <Container
              variant="primary"
              justifyContent="center"
              p="0.5rem"
              cursor="pointer"
              maxW="full"
              mt="1rem"
              mr="1rem"
            >
              {paymentsAsset && (
                <ChartHolders
                  loadingChart={loadingChart}
                  groupedValues={groupedValues}
                  groupValue={divisorValues}
                  assetCode={assetSelected.code}
                />
              )}
            </Container>

            <Container
              variant="primary"
              justifyContent="center"
              p="0.5rem"
              cursor="pointer"
              maxW={isLargerThanMd ? '340px' : 'full'}
              mt="1rem"
            >
              <TopHolders holders={topHolders} assetCode={assetSelected.code} />
            </Container>
          </Flex>

          {supplyAsset && (
            <ChartSupply
              loadingChart={loadingChart}
              supplyAsset={supplyAsset}
              chartPeriod={chartPeriod}
              setChartPeriod={setChartPeriod}
            />
          )}
        </Flex>
      )}
    </Flex>
  )
}
