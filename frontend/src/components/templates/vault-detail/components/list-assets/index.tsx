import { Box, Container, Flex, Text } from '@chakra-ui/react'
import React from 'react'

import { toCrypto } from 'utils/formatter'

import { CoinIcon, LockIcon } from 'components/icons'

interface IListAssets {
  vault: Hooks.UseVaultsTypes.IVault
}

export const ListAssets: React.FC<IListAssets> = ({ vault }) => {
  return (
    <Container variant="primary" justifyContent="center" p="0">
      <Flex
        alignItems="center"
        justifyContent="space-between"
        borderBottom="1px solid"
        borderColor={'gray.600'}
        h="3.5rem"
        px="1rem"
        fill="black"
        stroke="black"
        _dark={{ fill: 'white', stroke: 'white', borderColor: 'black.800' }}
      >
        <Text fontSize="sm" fontWeight="600">
          Assets
        </Text>
      </Flex>
      <Box px="1rem">
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
                  borderBottom="1px solid"
                  borderColor="gray.100"
                  h="3.5rem"
                >
                  <Flex alignItems="center" gap={3}>
                    <CoinIcon width="1.5rem" />
                    <Text fontSize="sm">{balance.asset_code}</Text>
                  </Flex>
                  <Flex alignItems="center" gap={2}>
                    <Text fontSize="sm">
                      {toCrypto(Number(balance.balance))}
                    </Text>
                    {!balance.is_authorized && <LockIcon width="1rem" />}
                  </Flex>
                </Flex>
              )
          )}
      </Box>
    </Container>
  )
}
