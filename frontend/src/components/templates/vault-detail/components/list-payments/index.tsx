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
} from '@chakra-ui/react'
import React from 'react'

import { STELLAR_EXPERT_TX_URL } from 'utils/constants/constants'
import { formatDateFull, toCrypto } from 'utils/formatter'

import { Loading } from 'components/atoms'
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
  loading: boolean
  assets: Hooks.UseAssetsTypes.IAssetDto[] | undefined
  isPrevDisabled: boolean
  getPaymentsDataByLink(link: 'prev' | 'next'): void
}

export const ListPayments: React.FC<IListPayments> = ({
  payments,
  vaults,
  vault,
  loading,
  assets,
  isPrevDisabled,
  getPaymentsDataByLink,
}) => {
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
      <Box px="1rem">
        {loading ? (
          <Loading />
        ) : payments?._embedded.records &&
          payments._embedded.records.length > 0 ? (
          <Table w="full">
            <Thead w="full">
              <Th w="2rem" p={0} />
              <Th>From</Th>
              <Th>To</Th>
              <Th>Asset</Th>

              <Th>Amount</Th>
              <Th>Date</Th>
              <Th />
            </Thead>
            <Tbody>
              {payments._embedded.records.map(
                payment =>
                  payment.type === 'payment' && (
                    <Tr>
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
