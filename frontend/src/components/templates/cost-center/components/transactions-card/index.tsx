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
} from '@chakra-ui/react'
import React from 'react'

import { formatDateFull, toCrypto } from 'utils/formatter'

import { NavLeftIcon, NavRightIcon, SendedIcon } from 'components/icons'

interface ITransactionsCard {
  transactions: Hooks.UseHorizonTypes.ITransactions | undefined
  vaults: Hooks.UseVaultsTypes.IVault[] | undefined
  assets: Hooks.UseAssetsTypes.IAssetDto[] | undefined
  isPrevDisabled: boolean
  getTransactionsByLink(link: 'prev' | 'next'): void
}

interface IHorizonData {
  name: string
  type: string
}

export const TransactionsCard: React.FC<ITransactionsCard> = ({
  transactions,
  vaults,
  assets,
  isPrevDisabled,
  getTransactionsByLink,
}) => {
  const formatAccount = (account: string): string => {
    return `${account.substring(0, 4)}...${account.substring(
      account.length - 4,
      account.length
    )}`
  }

  const walletToName = (publicKey: string): string => {
    if (
      assets &&
      assets.find(asset => asset.distributor.key.publicKey === publicKey)
    ) {
      return 'Asset issuer'
    }

    return (
      vaults?.find(vault => vault.wallet.key.publicKey === publicKey)?.name ||
      formatAccount(publicKey)
    )
  }

  const getTransactionData = (
    transaction: Hooks.UseHorizonTypes.ITransactionItem
  ): IHorizonData => {
    const accountCreated = transaction.effects?._embedded.records.find(
      effect => effect.type === 'account_created'
    )
    if (accountCreated) {
      return {
        name: walletToName(accountCreated.account),
        type: 'Account created',
      }
    }

    const credited = transaction.effects?._embedded.records.find(
      effect => effect.type === 'account_credited'
    )
    const debited = transaction.effects?._embedded.records.find(
      effect => effect.type === 'account_debited'
    )

    if (
      credited &&
      assets?.find(
        asset => asset.distributor.key.publicKey === credited.account
      ) &&
      debited &&
      debited.asset_issuer === debited.account
    ) {
      return {
        name: credited.asset_code,
        type: 'Minted',
      }
    }

    if (
      debited &&
      assets?.find(
        asset => asset.distributor.key.publicKey === debited.account
      ) &&
      credited &&
      credited.asset_issuer === credited.account
    ) {
      return {
        name: debited.asset_code,
        type: 'Burned',
      }
    }

    const accountDebited = transaction.effects?._embedded.records.find(
      effect => effect.type === 'account_debited'
    )
    if (accountDebited) {
      const accountCredited = transaction.effects?._embedded.records.find(
        effect => effect.type === 'account_credited'
      )
      return {
        name: `${walletToName(accountDebited.account)} to ${walletToName(
          accountCredited?.account || '-'
        )}`,
        type: 'Payment',
      }
    }
    return {
      name: '-',
      type: '-',
    }
  }

  return (
    <Container variant="primary" mb="1rem" p={4} w="full" maxW="full">
      <Text fontSize="md">Transaction's history</Text>
      <Table w="full" variant="list" mt="1rem">
        <Thead w="full">
          <Tr>
            <Th w="2rem" p={0} />
            <Th>Transaction</Th>
            <Th>Date</Th>
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
                    {formatDateFull(transaction.created_at)}
                  </Text>
                </Td>
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
