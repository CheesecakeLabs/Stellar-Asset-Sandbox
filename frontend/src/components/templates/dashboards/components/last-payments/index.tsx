import {
  Text,
  Container,
  Flex,
  Box,
  Skeleton,
  Tr,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  SimpleGrid,
  useMediaQuery,
} from '@chakra-ui/react'
import React from 'react'

import { getCurrencyIcon } from 'utils/constants/constants'
import { formatDateFull, formatDateFullClean, toCrypto } from 'utils/formatter'

interface ILastPayments {
  transactions: Hooks.UseDashboardsTypes.ITransaction[] | undefined
  assets: Hooks.UseAssetsTypes.IAssetDto[] | undefined
  vaults: Hooks.UseVaultsTypes.IVault[] | undefined
  loading: boolean
}

export const LastPayments: React.FC<ILastPayments> = ({
  transactions,
  loading,
  assets,
  vaults,
}) => {
  const [isLargerThanMd] = useMediaQuery('(min-width: 768px)')

  const walletToName = (publicKey: string): string => {
    if (assets?.find(asset => asset.distributor.key.publicKey === publicKey)) {
      return 'Asset Issuer'
    }
    return (
      vaults?.find(vault => vault.wallet.key.publicKey === publicKey)?.name ||
      'External account'
    )
  }

  return (
    <Container
      variant="primary"
      justifyContent="center"
      py="0.5rem"
      px="0.75rem"
      w="full"
      maxW="full"
      mt="1rem"
    >
      <Flex justifyContent="space-between" mb="1.25rem">
        <Text fontSize="xs" fontWeight="600">
          Latest payments
        </Text>
      </Flex>
      <Box>
        {loading ? (
          <Skeleton h="12rem" w="full" />
        ) : (
          <Flex>
            <Table w="full" variant="small">
              <Thead w="full">
                {isLargerThanMd && <Th></Th>}
                <Th>Date</Th>
                <Th>From</Th>
                <Th>Amount</Th>
                {isLargerThanMd && <Th>Asset</Th>}
                <Th>To</Th>
              </Thead>
              <Tbody>
                {transactions?.map(transaction => (
                  <Tr>
                    {isLargerThanMd && (
                      <Td>{getCurrencyIcon(transaction.asset.code, '1rem')}</Td>
                    )}
                    <Td>
                      {isLargerThanMd
                        ? formatDateFull(transaction.date)
                        : formatDateFullClean(transaction.date)}
                    </Td>
                    <Td>{walletToName(transaction.origin_pk)}</Td>
                    <Td>{`${toCrypto(Number(transaction.amount || 0))}`}</Td>
                    {isLargerThanMd && <Td>{`${transaction.asset.code}`}</Td>}
                    <Td>{walletToName(transaction.destination_pk)}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            {false && (
              <SimpleGrid
                columns={2}
                w="480px"
                ms="3rem"
                h="min-content"
                gap={4}
              >
                <Flex
                  flexDir="column"
                  borderEnd="1px solid"
                  borderColor="gray.400"
                  _dark={{ borderColor: 'black.800' }}
                >
                  <Text variant="secondary" mb="0.15rem">
                    Highest value transacted
                  </Text>
                  <Text fontWeight="600">9239</Text>
                  <Text variant="secondary" mb="0.15rem">
                    Banco 1
                  </Text>
                </Flex>

                <Flex flexDir="column" ms="1.5rem">
                  <Text variant="secondary" mb="0.15rem">
                    Vault with more receipts
                  </Text>
                  <Text fontWeight="600">9239</Text>
                  <Text variant="secondary" mb="0.15rem">
                    Banco 1
                  </Text>
                </Flex>

                <Flex
                  flexDir="column"
                  borderEnd="1px solid"
                  borderColor="gray.400"
                  _dark={{ borderColor: 'black.800' }}
                >
                  <Text variant="secondary" mb="0.15rem">
                    Asset more transactioned
                  </Text>
                  <Text fontWeight="600">9239</Text>
                  <Text variant="secondary" mb="0.15rem">
                    USDC
                  </Text>
                </Flex>

                <Flex flexDir="column" ms="1.5rem">
                  <Text variant="secondary" mb="0.15rem">
                    More payments
                  </Text>
                  <Text fontWeight="600">9239</Text>
                  <Text variant="secondary" mb="0.15rem">
                    Banco 1
                  </Text>
                </Flex>
              </SimpleGrid>
            )}
          </Flex>
        )}
      </Box>
    </Container>
  )
}
