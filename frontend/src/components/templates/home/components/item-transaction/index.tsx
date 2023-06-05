import { Flex, Img, Tag, Td, Text, Tr } from '@chakra-ui/react'
import React from 'react'

import { formatDateMY, formatDateY } from 'utils/formatter'

import { TypeTransaction } from 'components/enums/type-transaction'
import { MenuIcon } from 'components/icons'

interface IItemTransaction {
  transaction: Hooks.UseTransactionsTypes.ITransaction
}

export const ItemTransaction: React.FC<IItemTransaction> = ({
  transaction,
}) => {
  const typeTransactionColor = (type: TypeTransaction): string => {
    if (type === TypeTransaction.MINT) {
      return 'green'
    }
    if (type === TypeTransaction.BURN) {
      return 'red'
    }
    if (type === TypeTransaction.PAYMENT) {
      return 'blue'
    }
    return 'blue'
  }

  return (
    <Tr>
      <Td pl={2} pr={0} w="4rem">
        <Img src={transaction.icon} w="30px" h="30px" />
      </Td>
      <Td px={0}>
        <Text fontSize="sm" color="primary.normal">
          {transaction.name}
        </Text>
        <Text fontSize="xxs" color="primary.light">
          {transaction.asset}
        </Text>
      </Td>
      <Td px={0}>
        <Text fontSize="xs" color="gray.700">
          Date
        </Text>
        <Flex gap={1}>
          <Text fontSize="md" color="primary.normal">
            {formatDateMY(transaction.date)}
          </Text>
          <Text fontSize="sm" color="primary.light">
            {formatDateY(transaction.date)}
          </Text>
        </Flex>
      </Td>
      <Td px={0}>
        <Text fontSize="xs" color="gray.700">
          Type
        </Text>
        <Text fontSize="md" color="primary.normal">
          <Tag variant={typeTransactionColor(transaction.type)}>
            {transaction.type}
          </Tag>
        </Text>
      </Td>
      <Td
        display="flex"
        justifyContent="flex-end"
        flexDir="column"
        alignItems="flex-end"
        mr={6}
      >
        <Text fontSize="xs" color="gray.700">
          Amount
        </Text>
        <Flex gap={1}>
          <Text fontSize="md" color="primary.normal">
            {transaction.amount}
          </Text>
          <Text fontSize="sm" color="primary.light">
            {transaction.asset}
          </Text>
        </Flex>
      </Td>
      <Td w="4rem" p={0}>
        <MenuIcon />
      </Td>
    </Tr>
  )
}
