import { Container, Flex, SimpleGrid, Tag, Text } from '@chakra-ui/react'
import React from 'react'

import {
  STELLAR_EXPERT_ASSET,
  getCurrencyIcon,
} from 'utils/constants/constants'
import { typesAsset } from 'utils/constants/data-constants'
import { formatAccount, toCrypto } from 'utils/formatter'

import { InfoCard } from '../contracts-detail/components/info-card'
import { AccountsChart } from './components/accounts-chart'
import { LinkIcon, WalletIcon } from 'components/icons'

interface IAssetHomeTemplate {
  loading: boolean
  asset: Hooks.UseAssetsTypes.IAssetDto
}

export const AssetHomeTemplate: React.FC<IAssetHomeTemplate> = ({
  loading,
  asset,
}) => {
  const isFlagActive = (status: boolean): string => {
    return status ? 'actived' : 'none'
  }

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
              <Text fontSize="sm" color="gray.650" mr="0.5rem">
                {typesAsset.find(type => type.id === asset.asset_type)?.name ||
                  ''}
              </Text>
            </Flex>
          </Flex>

          <Flex ms="4rem" flexDir="column">
            <Flex>
              <Flex flexDir="column">
                <Text
                  fontSize="xs"
                  fontWeight="700"
                  color="gray.650"
                  mb="0.25rem"
                  _dark={{ color: 'white' }}
                >
                  Issuer
                </Text>
                <Text fontSize="sm">
                  {formatAccount(asset.issuer.key.publicKey)}
                </Text>
              </Flex>

              <Flex flexDir="column" ms="1.5rem">
                <Text
                  fontSize="xs"
                  fontWeight="700"
                  color="gray.650"
                  mb="0.25rem"
                  _dark={{ color: 'white' }}
                >
                  Distributor
                </Text>
                <Text fontSize="sm">
                  {formatAccount(asset.distributor.key.publicKey)}
                </Text>
              </Flex>
            </Flex>

            <Flex flexDir="column" mt="1rem">
              <Text
                fontSize="xs"
                fontWeight="700"
                color="gray.650"
                mb="0.5rem"
                _dark={{ color: 'white' }}
              >
                Flags
              </Text>
              <Flex gap={2}>
                <Tag
                  variant={isFlagActive(
                    asset.assetData?.flags.auth_required || false
                  )}
                >
                  Authorize Required
                </Tag>
                <Tag
                  variant={isFlagActive(
                    asset.assetData?.flags.auth_clawback_enabled || false
                  )}
                >
                  Clawback enabled
                </Tag>
                <Tag
                  variant={isFlagActive(
                    asset.assetData?.flags.auth_revocable || false
                  )}
                >
                  Freeze enabled
                </Tag>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Container>

      <SimpleGrid columns={{ md: 2, sm: 1 }} mt="1rem" gap={3}>
        <Flex flexDir="column" w="full" gap={3}>
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
        <AccountsChart
          authorized={asset.assetData?.accounts.authorized || 0}
          unauthorized={
            (asset.assetData?.accounts.authorized_to_maintain_liabilities ||
              0) + (asset.assetData?.accounts.unauthorized || 0)
          }
        />
      </SimpleGrid>
    </Flex>
  )
}
