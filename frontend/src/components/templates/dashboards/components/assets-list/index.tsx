import { Text, Container, Flex, Box } from '@chakra-ui/react';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';



import { useDashboards } from 'hooks/useDashboards';
import { useHorizon } from 'hooks/useHorizon';
import { useVaults } from 'hooks/useVaults';
import { getCurrencyIcon } from 'utils/constants/constants';
import { formatAccount, toCrypto } from 'utils/formatter';



import { ChevronDownIcon } from 'components/icons';
import { AccountsChart } from 'components/molecules/accounts-chart';
import { ChartPayments } from 'components/molecules/chart-payments';
import { TChartPeriod } from 'components/molecules/chart-period';



import { ChartHolders } from '../chart-holders';
import { TopHolders } from '../top-holders';


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
  const [paymentsAsset, setPaymentsAsset] =
    useState<Hooks.UseDashboardsTypes.IAsset>()
  const [chartPeriod, setChartPeriod] = useState<TChartPeriod>('24h')
  const [topHolders, setTopHolders] =
    useState<Hooks.UseHorizonTypes.IHolder[]>()
  const [groupedValues, setGroupedValues] = useState<number[]>([])
  const [divisorValues, setDivisorValues] = useState<number>(0)

  const { getPaymentsByAssetId, loadingChart } = useDashboards()
  const { getAssetAccounts } = useHorizon()
  const { getVaults } = useVaults()

  useEffect(() => {
    if (assetSelected) {
      getPaymentsByAssetId(assetSelected.id.toString(), 0, chartPeriod).then(
        paymentsAsset => setPaymentsAsset(paymentsAsset)
      )
    }
  }, [assetSelected, chartPeriod, getPaymentsByAssetId])

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

        const groupedValues = [0, 0, 0, 0, 0]
        const divisorValue =
          (filteredAccounts ? filteredAccounts[0].amount : 0) / 5

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
            if (amount < divisorValue) {
              groupedValues[0]++
            } else if (amount < divisorValue * 2) {
              groupedValues[1]++
            } else if (amount < divisorValue * 3) {
              groupedValues[2]++
            } else if (amount < divisorValue * 4) {
              groupedValues[3]++
            } else {
              groupedValues[4]++
            }
          })

        setGroupedValues(groupedValues)
        setDivisorValues(divisorValue)
      })
    }
  }, [assetSelected, getAssetAccounts, getVaults])

  return (
    <Flex flexDir="column">
      <Flex overflowX="scroll">
        {assets?.map(asset => (
          <Container
            variant="primary"
            justifyContent="center"
            p="0.5rem"
            mr="0.5rem"
            cursor="pointer"
            bg={asset.id === assetSelected?.id ? 'primary.normal' : undefined}
            onClick={(): void => {
              setAssetSelected(
                assetSelected?.id === asset.id ? undefined : asset
              )
            }}
          >
            <Flex alignItems="center" h="full">
              <Box
                w="2rem"
                fill={asset.id === assetSelected?.id ? 'white' : 'black'}
                stroke={asset.id === assetSelected?.id ? 'white' : 'black'}
                _dark={{ fill: 'white', stroke: 'white' }}
              >
                {getCurrencyIcon(asset.code, '1.5rem')}
              </Box>
              <Flex ms="0.75rem" flexDir="column" w="full" h="min-content">
                <Text
                  fontSize="sm"
                  fontWeight="700"
                  color={asset.id === assetSelected?.id ? 'white' : undefined}
                >
                  {asset.code}
                </Text>
                <Text
                  fontSize="xs"
                  color={asset.id === assetSelected?.id ? 'white' : undefined}
                >
                  {toCrypto(Number(asset.assetData?.amount || 0))}
                </Text>
              </Flex>
              {assetSelected ? (
                <Box fill="white">
                  <ChevronDownIcon />
                </Box>
              ) : (
                <ChevronDownIcon />
              )}
            </Flex>
          </Container>
        ))}
      </Flex>
      {assetSelected && (
        <Container
          variant="primary"
          justifyContent="center"
          p="0.5rem"
          mr="0.5rem"
          cursor="pointer"
          maxW="full"
          mt="1rem"
        >
          <Flex flexDir="column">
            <Flex gap={4}>
              <Flex
                w="full"
                borderEnd="1px solid"
                borderColor={'gray.600'}
                _dark={{ borderColor: 'black.800' }}
              >
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
              <Flex w="30%" h="min-content" flexDir="column">
                <AccountsChart
                  authorized={assetSelected.assetData?.accounts.authorized || 0}
                  unauthorized={
                    (assetSelected.assetData?.accounts
                      .authorized_to_maintain_liabilities || 0) +
                    (assetSelected.assetData?.accounts.unauthorized || 0)
                  }
                  authorizedLabel={'Authorized'}
                  unauthorizedLabel={'Pending authorization'}
                />
              </Flex>
            </Flex>
            <Flex gap={4} mt="1.5rem">
              <Flex
                w="full"
                borderEnd="1px solid"
                borderColor={'gray.600'}
                _dark={{ borderColor: 'black.800' }}
              >
                {paymentsAsset && (
                  <ChartHolders
                    loadingChart={loadingChart}
                    groupedValues={groupedValues}
                    groupValue={divisorValues}
                  />
                )}
              </Flex>
              <Flex w="30%">
                <TopHolders
                  holders={topHolders}
                  assetCode={assetSelected.code}
                />
              </Flex>
            </Flex>
          </Flex>
        </Container>
      )}
    </Flex>
  )
}