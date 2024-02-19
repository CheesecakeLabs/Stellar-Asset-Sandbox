import {
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

import { formatDateFullClean, toCrypto } from 'utils/formatter'

import { NavLeftIcon, NavRightIcon, SendedIcon } from 'components/icons'

import { IHorizonData } from 'app/core/pages/cost-center'

interface ITransactionsCard {
  transactions: Hooks.UseHorizonTypes.ITransactions | undefined
  isPrevDisabled: boolean
  getTransactionsByLink(link: 'prev' | 'next'): void
  getTransactionData(
    transaction: Hooks.UseHorizonTypes.ITransactionItem
  ): IHorizonData
}

export const TransactionsCard: React.FC<ITransactionsCard> = ({
  transactions,
  isPrevDisabled,
  getTransactionsByLink,
  getTransactionData,
}) => {
  const [isLargerThanSm] = useMediaQuery('(min-width: 480px)')

  return (
    <Container variant="primary" mb="1rem" p={4} w="full" maxW="full">
      <Text fontSize="md">Transaction's history</Text>
      {isLargerThanSm ? (
        <Table w="full" variant="list" mt="1rem">
          <Thead w="full">
            <Tr>
              <Th w="2rem" p={0} />
              <Th>Transaction</Th>
              <Th>Date</Th>
              <Th>Asset</Th>
              <Th>Accounts</Th>
              <Th>Covered fee</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transactions?._embedded.records.map(transaction => {
              const transactionData = getTransactionData(transaction)
              return (
                <Tr>
                  <Td px="1rem" py={0}>
                    <SendedIcon width="20px" height="20px" />
                  </Td>
                  <Td>{transactionData.type}</Td>
                  <Td>
                    <Text fontSize="sm">
                      {formatDateFullClean(transaction.created_at)}
                    </Text>
                  </Td>
                  <Td>{transactionData.asset}</Td>
                  <Td>{transactionData.name}</Td>
                  <Td>{`${toCrypto(
                    Number(transaction.fee_charged),
                    undefined,
                    true
                  )} XLM`}</Td>
                </Tr>
              )
            })}
          </Tbody>
        </Table>
      ) : (
        <Flex flexDir="column">
          {transactions?._embedded.records?.map((transaction, index) => {
            const transactionData = getTransactionData(transaction)
            return (
              <Flex
                key={index}
                flexDir="column"
                borderBottom="1px solid"
                borderColor={'gray.600'}
                _dark={{ borderColor: 'black.800' }}
                pb={2}
                pt={2}
                gap={1}
              >
                <Flex alignItems="center" gap={2}>
                  <Text>{formatDateFullClean(transaction.created_at)}</Text>
                </Flex>
                <Flex gap="0.35rem">
                  <Text fontWeight="bold">Transaction</Text>
                  <Text>{`${transactionData.type}`}</Text>
                </Flex>
                <Flex gap="0.35rem" alignItems="center">
                  <Text fontWeight="bold">Asset</Text>
                  <Text>{transactionData.asset}</Text>
                </Flex>
                <Flex gap="0.35rem">
                  <Text fontWeight="bold">Accounts</Text>
                  <Text>{`${transactionData.name}`}</Text>
                </Flex>
                <Flex gap="0.35rem">
                  <Text fontWeight="bold">Fee charged</Text>
                  <Text>{`${toCrypto(
                    Number(transaction.fee_charged),
                    undefined,
                    true
                  )} XLM`}</Text>
                </Flex>
              </Flex>
            )
          })}
        </Flex>
      )}
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
            if (transactions?._links.prev.href) {
              getTransactionsByLink('prev')
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
          isDisabled={transactions?._links.next.results === 0}
          onClick={(): void => {
            if (transactions?._links.next.href) {
              getTransactionsByLink('next')
            }
          }}
        >
          Next
        </Button>
      </Flex>
    </Container>
  )
}
