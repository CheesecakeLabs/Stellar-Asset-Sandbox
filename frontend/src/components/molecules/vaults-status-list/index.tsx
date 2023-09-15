import {
  Box,
  Container,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import React from 'react'

import { LockIcon } from 'components/icons'

import { AccountsChart } from '../accounts-chart'

interface IVaultsStatusList {
  vaultsStatus: Hooks.UseVaultsTypes.IVaultAccountName[] | undefined
  asset: Hooks.UseAssetsTypes.IAssetDto
  authorizedLabel: string
  unauthorizedLabel: string
}

export const VaultsStatusList: React.FC<IVaultsStatusList> = ({
  vaultsStatus,
  asset,
  authorizedLabel,
  unauthorizedLabel,
}) => {
  return (
    <Container variant="primary" maxW="full" mt="1rem" py="0.5rem" px="0.75rem">
      <Text fontSize="xs" fontWeight="600" mb="1rem">
        Vaults
      </Text>
      <Flex w="full" maxW="full" flexDir="column" alignItems="center">
        <Box w="480px" mb="1.5rem">
          <AccountsChart
            authorized={asset.assetData?.accounts.authorized || 0}
            unauthorized={
              (asset.assetData?.accounts.authorized_to_maintain_liabilities ||
                0) + (asset.assetData?.accounts.unauthorized || 0)
            }
            authorizedLabel={authorizedLabel}
            unauthorizedLabel={unauthorizedLabel}
          />
        </Box>
        <Table variant="list">
          <Thead>
            <Th>Account</Th>
            <Th>Status</Th>
          </Thead>
          <Tbody>
            {vaultsStatus?.map(vaultStatus => (
              <Tr>
                <Td>{vaultStatus.name}</Td>
                <Td>
                  <Flex alignItems="center" gap={3}>
                    {!vaultStatus.isAuthorized && (
                      <LockIcon height="16px" width="16px" />
                    )}
                    {vaultStatus.isAuthorized
                      ? authorizedLabel
                      : unauthorizedLabel}
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Flex>
    </Container>
  )
}
