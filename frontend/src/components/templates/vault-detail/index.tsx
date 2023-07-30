import { Container, Flex, Tag, Text } from '@chakra-ui/react'
import React from 'react'

import { toCrypto } from 'utils/formatter'

import { CoinIcon, LockIcon } from 'components/icons'

interface IVaultDetailTemplate {
  vault: Hooks.UseVaultsTypes.IVault
}

export const VaultDetailTemplate: React.FC<IVaultDetailTemplate> = ({
  vault,
}) => {
  return (
    <Flex flexDir="column" w="full">
      <Flex maxW="584px" alignSelf="center" flexDir="column" w="full">
        <Flex alignItems="center" mb="1.5rem">
          <Text fontSize="2xl" fontWeight="400">
            {vault.name}
          </Text>
          <Tag
            variant="blue"
            ms="1rem"
            textAlign="center"
            fontSize="xs"
            fontWeight="700"
            w="min-content"
          >
            {vault.vault_category.name}
          </Tag>
        </Flex>
        <Container variant="primary" justifyContent="center" p="2rem">
          {vault.accountData &&
            vault.accountData.balances.map(
              balance =>
                balance.asset_code && (
                  <Flex
                    justifyContent="space-between"
                    fill="black"
                    stroke="black"
                    _dark={{ fill: 'white', stroke: 'white' }}
                    alignItems="center"
                    mb="0.75rem"
                  >
                    <Flex alignItems="center" gap={2}>
                      <CoinIcon width="1.5rem" />
                      <Text fontSize="sm">{balance.asset_code}</Text>
                    </Flex>
                    <Flex alignItems="center" gap={2}>
                      {toCrypto(Number(balance.balance))}
                      {!balance.is_authorized && <LockIcon width="1rem" />}
                    </Flex>
                  </Flex>
                )
            )}
        </Container>
      </Flex>
    </Flex>
  )
}
