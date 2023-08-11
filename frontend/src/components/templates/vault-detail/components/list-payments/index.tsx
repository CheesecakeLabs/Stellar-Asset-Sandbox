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

import { STELLAR_EXPERT_TX_URL } from 'utils/constants/constants'
import { formatDateFull, toCrypto } from 'utils/formatter'

import { Loading } from 'components/atoms'
import { LinkIcon, ReceivedIcon, SendedIcon } from 'components/icons'
import { Empty } from 'components/molecules/empty'

interface IListPayments {
  payments: Hooks.UseHorizonTypes.IPayment[] | undefined
  vaults: Hooks.UseVaultsTypes.IVault[] | undefined
  vault: Hooks.UseVaultsTypes.IVault | undefined
  loading: boolean
  assets: Hooks.UseAssetsTypes.IAssetDto[] | undefined
}

export const ListPayments: React.FC<IListPayments> = ({
  payments,
  vaults,
  vault,
  loading,
  assets,
}) => {
  const walletToName = (publicKey: string): string => {
    if (assets?.find(asset => asset.distributor.key.publicKey === publicKey)) {
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
        {loading ? (
          <Loading />
        ) : payments && payments.length > 0 ? (
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
                <Th
                  borderColor={'gray.400'}
                  _dark={{ borderColor: 'black.800' }}
                />
              </Tr>
            </Thead>
            <Tbody>
              {payments.map(
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
                      <Td>
                        <Flex
                          cursor="pointer"
                          _dark={{ fill: 'white' }}
                          onClick={(): Window | null =>
                            window.open(
                              `${STELLAR_EXPERT_TX_URL}/${payment.transaction_hash}`,
                              '_blank'
                            )
                          }
                        >
                          <LinkIcon />
                        </Flex>
                      </Td>
                    </Tr>
                  )
              )}
            </Tbody>
          </Table>
        ) : (
          <Empty title={'No transactions in this vault'} hideIcon />
        )}
      </Box>
    </Container>
  )
}
