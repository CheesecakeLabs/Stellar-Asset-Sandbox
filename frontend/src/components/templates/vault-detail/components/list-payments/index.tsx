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

import { formatDateFull, toCrypto } from 'utils/formatter'

import { ReceivedIcon, SendedIcon } from 'components/icons'

interface IListPayments {
  payments: Hooks.UseHorizonTypes.IPayment[] | undefined
  vaults: Hooks.UseVaultsTypes.IVault[] | undefined
  vault: Hooks.UseVaultsTypes.IVault | undefined
  distributorWallet: string
}

export const ListPayments: React.FC<IListPayments> = ({
  payments,
  vaults,
  vault,
  distributorWallet,
}) => {
  const walletToName = (publicKey: string): string => {
    if (publicKey === distributorWallet) {
      return 'Distributor'
    }
    return (
      vaults?.find(vault => vault.wallet.key.publicKey === publicKey)?.name ||
      'External account'
    )
  }

  const isCurrentVault = (publicKey: string): boolean => {
    return vault?.wallet.key.publicKey === publicKey
  }

  return (
    <Container
      variant="primary"
      justifyContent="center"
      p="0"
      w="full"
      maxW="full"
    >
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
          Payments
        </Text>
      </Flex>
      <Box px="1rem">
        <Table w="full">
          <Thead w="full">
            <Tr>
              <Th
                color={'gray.700'}
                borderColor={'gray.400'}
                _dark={{ borderColor: 'black.800' }}
                w="2rem"
                p={0}
              />
              <Th
                color={'gray.700'}
                borderColor={'gray.400'}
                _dark={{ borderColor: 'black.800' }}
              >
                From
              </Th>
              <Th
                color={'gray.700'}
                borderColor={'gray.400'}
                _dark={{ borderColor: 'black.800' }}
              >
                To
              </Th>
              <Th
                color={'gray.700'}
                borderColor={'gray.400'}
                _dark={{ borderColor: 'black.800' }}
              >
                Asset
              </Th>

              <Th
                color={'gray.700'}
                borderColor={'gray.400'}
                _dark={{ borderColor: 'black.800' }}
              >
                Amount
              </Th>
              <Th
                color={'gray.700'}
                borderColor={'gray.400'}
                _dark={{ borderColor: 'black.800' }}
              >
                Date
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {payments &&
              payments.map(
                payment =>
                  payment.type === 'payment' && (
                    <Tr
                      fill="black"
                      stroke="black"
                      _dark={{ fill: 'white', stroke: 'white' }}
                    >
                      <Td
                        borderColor={'gray.400'}
                        _dark={{ borderColor: 'black.800' }}
                        px="1rem"
                        py={0}
                      >
                        {isCurrentVault(payment.from) ? (
                          <SendedIcon width="1.25rem" />
                        ) : (
                          <ReceivedIcon width="1.25rem" />
                        )}
                      </Td>
                      <Td
                        borderColor={'gray.400'}
                        _dark={{ borderColor: 'black.800' }}
                      >
                        {walletToName(payment.from)}
                      </Td>
                      <Td
                        borderColor={'gray.400'}
                        _dark={{ borderColor: 'black.800' }}
                      >
                        {walletToName(payment.to)}
                      </Td>
                      <Td
                        borderColor={'gray.400'}
                        _dark={{ borderColor: 'black.800' }}
                      >
                        {payment.asset_code}
                      </Td>
                      <Td
                        borderColor={'gray.400'}
                        _dark={{ borderColor: 'black.800' }}
                      >
                        {toCrypto(Number(payment.amount))}
                      </Td>
                      <Td
                        borderColor={'gray.400'}
                        _dark={{ borderColor: 'black.800', fill: 'white' }}
                      >
                        <Text fontSize="sm">
                          {formatDateFull(payment.created_at)}
                        </Text>
                      </Td>
                    </Tr>
                  )
              )}
          </Tbody>
        </Table>
      </Box>
    </Container>
  )
}