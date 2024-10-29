import {
  Button,
  Container,
  Flex,
  Table,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useMediaQuery,
} from '@chakra-ui/react'
import React, { ReactElement, useState } from 'react'
import { ChevronDown, ChevronUp, Flag } from 'react-feather'

import { formatDateFullClean, toCrypto } from 'utils/formatter'

import {
  AddIcon,
  AuthorizeIcon,
  BackIcon,
  BlockIcon,
  BurnIcon,
  ContractInvokeIcon,
  ContractRestoreIcon,
  NavLeftIcon,
  NavRightIcon,
  SendedIcon,
  TransferIcon,
  TrustlineIcon,
} from 'components/icons'

import { IHorizonData } from 'app/core/pages/cost-center'

interface ITransactionsCard {
  transactions: Hooks.UseHorizonTypes.ITransactions | undefined
  isPrevDisabled: boolean
  USDPrice: Hooks.UseAssetsTypes.IPriceConversion | undefined
  getTransactionsByLink(link: 'prev' | 'next'): void
  getTransactionData(
    transaction: Hooks.UseHorizonTypes.ITransactionItem
  ): IHorizonData
}

export const TransactionsCard: React.FC<ITransactionsCard> = ({
  transactions,
  isPrevDisabled,
  USDPrice,
  getTransactionsByLink,
  getTransactionData,
}) => {
  const [detailsController, setDetailsController] = useState<number[]>([])
  const [isLargerThanSm] = useMediaQuery('(min-width: 480px)')

  const operationIcon = (type: string): ReactElement => {
    if (type === 'Account created') {
      return <Flag width="16px" height="16px" />
    }
    if (type === 'Payment') {
      return <SendedIcon width="16px" height="16px" />
    }
    if (type === 'Minted') {
      return <AddIcon width="16px" height="16px" />
    }
    if (type === 'Authorized') {
      return <AuthorizeIcon width="16px" height="16px" />
    }
    if (type === 'Clawbacked') {
      return <BackIcon width="16px" height="16px" />
    }
    if (type === 'Freezed') {
      return <BlockIcon width="16px" height="16px" />
    }
    if (type === 'Burned') {
      return <BurnIcon width="16px" height="16px" />
    }
    if (type === 'Distribute') {
      return <TransferIcon width="16px" height="16px" />
    }
    if (type === 'Change trustline') {
      return <TrustlineIcon width="16px" height="16px" />
    }
    if (type === 'Contract invoke') {
      return <ContractInvokeIcon width="16px" height="16px" />
    }
    if (type === 'Contract restore') {
      return <ContractRestoreIcon width="16px" height="16px" />
    }
    return <Flag width="16px" height="16px" />
  }

  const isExpanded = (index: number): boolean => {
    return detailsController.includes(index)
  }

  const convertToUSD = (feeCharged: string): string => {
    return toCrypto(Number(feeCharged) * (USDPrice?.USD || 1), undefined, true)
  }

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
              <Th>Covered fee (XLM)</Th>
              <Th>Covered fee (USD)</Th>
              <Th p={1} />
            </Tr>
          </Thead>
          <Tbody>
            {transactions?._embedded.records.map((transaction, index) => {
              const transactionData = getTransactionData(transaction)
              return (
                <React.Fragment key={index}>
                  <Tr
                    cursor="pointer"
                    onClick={(): void =>
                      setDetailsController(prev =>
                        isExpanded(index)
                          ? prev.filter(item => item !== index)
                          : [...prev, index]
                      )
                    }
                  >
                    <Td px="1rem" py={0}>
                      {operationIcon(transactionData.type)}
                    </Td>
                    <Td>{transactionData.type}</Td>
                    <Td>
                      <Text>{formatDateFullClean(transaction.created_at)}</Text>
                    </Td>
                    <Td>{`${toCrypto(
                      Number(transaction.fee_charged),
                      undefined,
                      true
                    )} XLM`}</Td>
                    <Td>{`$${convertToUSD(transaction.fee_charged)}`}</Td>
                    <Td p={1}>
                      {isExpanded(index) ? <ChevronUp /> : <ChevronDown />}
                    </Td>
                  </Tr>
                  {isExpanded(index) && (
                    <Tr>
                      <Td colSpan={6}>
                        <Flex gap={10}>
                          <Flex flexDir="column" gap={2}>
                            <Tag variant="label">Accounts</Tag>
                            <Text fontWeight="700" fontSize="sm">
                              {transactionData.name}
                            </Text>
                          </Flex>
                          <Flex flexDir="column" gap={2} alignItems="center">
                            <Tag variant="label">Asset</Tag>
                            <Text fontWeight="700" fontSize="sm">
                              {transactionData.asset}
                            </Text>
                          </Flex>
                        </Flex>
                      </Td>
                    </Tr>
                  )}
                </React.Fragment>
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
                  <Text fontWeight="bold">Fee charged (XLM)</Text>
                  <Text>{`${toCrypto(
                    Number(transaction.fee_charged),
                    undefined,
                    true
                  )} XLM`}</Text>
                </Flex>
                <Flex gap="0.35rem">
                  <Text fontWeight="bold">Fee charged (USD)</Text>
                  <Text>{`$${convertToUSD(transaction.fee_charged)}`}</Text>
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
