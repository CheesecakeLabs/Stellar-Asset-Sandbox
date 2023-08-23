import { Container, Flex, Tag, Text } from '@chakra-ui/react'
import React, { Dispatch, SetStateAction } from 'react'

import {
  STELLAR_EXPERT_ASSET,
  getCurrencyIcon,
} from 'utils/constants/constants'
import { typesAsset } from 'utils/constants/data-constants'
import { formatAccount, toCrypto } from 'utils/formatter'

import { InfoCard } from '../contracts-detail/components/info-card'
import { ChartPayments } from './components/chart-payments'
import { LinkIcon, WalletIcon } from 'components/icons'
import { TChartPeriod } from 'components/molecules/chart-period'

interface IAssetHomeTemplate {
  loading: boolean
  loadingChart: boolean
  asset: Hooks.UseAssetsTypes.IAssetDto
  paymentsAsset: Hooks.UseDashboardsTypes.IAsset | undefined
  chartPeriod: TChartPeriod
  setChartPeriod: Dispatch<SetStateAction<TChartPeriod>>
}

export const AssetHomeTemplate: React.FC<IAssetHomeTemplate> = ({
  asset,
  loadingChart,
  paymentsAsset,
  chartPeriod,
  setChartPeriod,
}) => {
  return (
    <Flex flexDir="column" w="full">
      <Container variant="primary" justifyContent="center" maxW="full" p="1rem">
        <Flex flexDir="column">
          <Flex mb="1rem">
            <Flex
              gap="1rem"
              alignItems="center"
              me="1rem"
              fill="black"
              stroke="black"
              _dark={{ fill: 'white', stroke: 'white' }}
            >
              {getCurrencyIcon(asset.code, '2.5rem')}
            </Flex>
            <Flex
              borderBottom="1px solid"
              borderColor={'gray.600'}
              flexDir="column"
              w="full"
              pb="0.5rem"
              _dark={{ borderColor: 'black.800' }}
            >
              <Flex alignItems="center">
                <Text fontSize="xl" fontWeight="600">
                  {`${asset.name} (${asset.code})`}
                </Text>
                <Flex
                  cursor="pointer"
                  ms="0.5rem"
                  _dark={{ fill: 'white' }}
                  onClick={(): Window | null =>
                    window.open(
                      `${STELLAR_EXPERT_ASSET}/${asset.code}-${asset.issuer.key.publicKey}`,
                      '_blank'
                    )
                  }
                >
                  <LinkIcon />
                </Flex>
              </Flex>
              <Text fontSize="sm" mr="0.5rem">
                {typesAsset.find(type => type.id === asset.asset_type)?.name ||
                  ''}
              </Text>
            </Flex>
          </Flex>

          <Flex ms="4rem" flexDir="column">
            <Flex>
              <Flex flexDir="column">
                <Text fontSize="xs" fontWeight="700" mb="0.25rem">
                  Issuer
                </Text>
                <Text fontSize="sm">
                  {formatAccount(asset.issuer.key.publicKey)}
                </Text>
              </Flex>

              <Flex flexDir="column" ms="1.5rem">
                <Text fontSize="xs" fontWeight="700" mb="0.25rem">
                  Distributor
                </Text>
                <Text fontSize="sm">
                  {formatAccount(asset.distributor.key.publicKey)}
                </Text>
              </Flex>
            </Flex>

            <Flex flexDir="column" mt="1rem">
              <Text fontSize="xs" fontWeight="700" mb="0.5rem">
                Flags
              </Text>
              <Flex gap={2}>
                {asset.assetData?.flags.auth_required && (
                  <Tag variant={'actived'}>Authorize Required</Tag>
                )}
                {asset.assetData?.flags.auth_clawback_enabled && (
                  <Tag variant={'actived'}>Clawback enabled</Tag>
                )}
                {asset.assetData?.flags.auth_revocable && (
                  <Tag variant={'actived'}>Freeze enabled</Tag>
                )}
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Container>

      <Flex flexDir="row" w="full" gap={3} mt="1rem">
        <InfoCard
          title={`Total Supply`}
          icon={<WalletIcon />}
          value={toCrypto(Number(asset.assetData?.amount || 0))}
        />
        <InfoCard
          title={`Main Vault`}
          icon={<WalletIcon />}
          value={toCrypto(Number(asset.distributorBalance?.balance || 0))}
        />
      </Flex>

      {paymentsAsset && (
        <ChartPayments
          loadingChart={loadingChart}
          paymentsAsset={paymentsAsset}
          chartPeriod={chartPeriod}
          setChartPeriod={setChartPeriod}
        />
      )}
    </Flex>
  )
}
