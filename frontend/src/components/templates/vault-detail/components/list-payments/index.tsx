import {
  Box,
  Button,
  Container,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useMediaQuery,
} from '@chakra-ui/react'
import React from 'react'

import { STELLAR_EXPERT_TX_URL } from 'utils/constants/constants'
import { formatDateFull, formatDateFullClean, toCrypto } from 'utils/formatter'

import {
  LinkIcon,
  NavLeftIcon,
  NavRightIcon,
  ReceivedIcon,
  SendedIcon,
} from 'components/icons'
import { Empty } from 'components/molecules/empty'

interface IListPayments {
  payments: Hooks.UseHorizonTypes.IPayments | undefined
  vaults: Hooks.UseVaultsTypes.IVault[] | undefined
  vault: Hooks.UseVaultsTypes.IVault | undefined
  assets: Hooks.UseAssetsTypes.IAssetDto[] | undefined
  isPrevDisabled: boolean
  getPaymentsDataByLink(link: 'prev' | 'next'): void
}

export const ListPayments: React.FC<IListPayments> = ({
  payments,
  vaults,
  vault,
  assets,
  isPrevDisabled,
  getPaymentsDataByLink,
}) => {
  const [isLargerThanMd] = useMediaQuery('(min-width: 768px)')
  const [isLargerThanSm] = useMediaQuery('(min-width: 480px)')

  const walletToName = (publicKey: string): string => {
    if (assets?.find(asset => asset.distributor.key.publicKey === publicKey)) {
      return 'Asset Issuer'
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
      <Box px="1rem" overflowX="auto">
        {payments?._embedded.records &&
        payments._embedded.records.length > 0 ? (
          isLargerThanSm ? (
            <Table w="full" variant="list">
              <Thead w="full">
                <Tr>
                  <Th w="2rem" p={0} />
                  <Th>From</Th>
                  <Th>To</Th>
                  <Th>Asset</Th>

                  <Th>Amount</Th>
                  <Th>Date</Th>
                  <Th />
                </Tr>
              </Thead>
              <Tbody>
                {payments._embedded.records.map(
                  (payment, index) =>
                    payment.type === 'payment' && (
                      <Tr key={index}>
                        <Td px="1rem" py={0}>
                          {isCurrentVault(payment.from) ? (
                            <SendedIcon width="1.25rem" />
                          ) : (
                            <ReceivedIcon width="1.25rem" />
                          )}
                        </Td>
                        <Td>{walletToName(payment.from)}</Td>
                        <Td>{walletToName(payment.to)}</Td>
                        <Td>{payment.asset_code}</Td>
                        <Td>{toCrypto(Number(payment.amount))}</Td>
                        <Td>
                          <Text fontSize="sm">
                            {isLargerThanMd
                              ? formatDateFull(payment.created_at)
                              : formatDateFullClean(payment.created_at)}
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
            <Flex flexDir="column">
              {payments._embedded.records.map(
                (payment, index) =>
                  payment.type === 'payment' && (
                    <Flex
                      key={index}
                      flexDir="column"
                      borderBottom="1px solid"
                      borderColor={'gray.600'}
                      _dark={{ borderColor: 'black.800' }}
                      pb={2}
                      pt={2}
                      gap={1}
                      onClick={(): Window | null =>
                        window.open(
                          `${STELLAR_EXPERT_TX_URL}/${payment.transaction_hash}`,
                          '_blank'
                        )
                      }
                    >
                      <Flex alignItems="center" gap={2}>
                        {isCurrentVault(payment.from) ? (
                          <SendedIcon width="1rem" height="1rem" />
                        ) : (
                          <ReceivedIcon width="1rem" height="1rem" />
                        )}
                        <Text>{formatDateFull(payment.created_at)}</Text>
                      </Flex>
                      <Flex gap="0.35rem" alignItems="center">
                        <Text fontWeight="bold">FROM</Text>
                        <Text>{walletToName(payment.from)}</Text>
                        <Text fontWeight="bold">TO</Text>
                        <Text>{walletToName(payment.to)}</Text>
                      </Flex>
                      <Flex gap="0.35rem">
                        <Text fontWeight="bold">Asset</Text>
                        <Text>{payment.asset_code}</Text>
                      </Flex>
                      <Flex gap="0.35rem">
                        <Text fontWeight="bold">Amount</Text>
                        <Text>{toCrypto(Number(payment.amount))}</Text>
                      </Flex>
                    </Flex>
                  )
              )}
            </Flex>
          )
        ) : (
          <Empty title={'No transactions'} hideIcon />
        )}
      </Box>
      <Flex justifyContent="flex-end">
        <Button
          variant={'menuButton'}
          border="0"
          w="min-content"
          leftIcon={
            <Flex w="1rem" justifyContent="center">
              <NavLeftIcon />
            </Flex>
          }
          isDisabled={isPrevDisabled}
          onClick={(): void => {
            if (payments?._links.prev.href) {
              getPaymentsDataByLink('prev')
            }
          }}
        >
          Previous
        </Button>
        <Button
          variant={'menuButton'}
          border="0"
          w="min-content"
          rightIcon={
            <Flex w="1rem" justifyContent="center">
              <NavRightIcon />
            </Flex>
          }
          isDisabled={payments?._links.next.results === 0}
          onClick={(): void => {
            if (payments?._links.next.href) {
              getPaymentsDataByLink('next')
            }
          }}
        >
          Next
        </Button>
      </Flex>
    </Container>
  )
}
