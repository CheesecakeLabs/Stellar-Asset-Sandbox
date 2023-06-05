import {
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Table,
  TableContainer,
  Tbody,
  Text,
} from '@chakra-ui/react'
import React from 'react'

import { mockupTransactions } from 'utils/mockups'

import { SearchIcon } from 'components/icons'

import { ItemTransaction } from '../item-transaction'

export const LastTransactions: React.FC = () => {
  return (
    <Flex borderRadius="1rem" bg="white" w="full" p="2rem" flexDir="column">
      <Text size="sm" color="primary.light">
        Last Transactions
      </Text>
      <InputGroup mt="1rem" mb="2rem" maxW="416px">
        <InputLeftElement pointerEvents="none" h="2.5rem">
          <SearchIcon />
        </InputLeftElement>
        <Input
          px="3rem"
          type="text"
          placeholder="Asset Name, date or type"
          bg="gray.100"
          borderRadius="1rem"
          fontSize="xs"
          h="2.5rem"
        />
      </InputGroup>
      <TableContainer>
        <Table>
          <Tbody>
            {mockupTransactions.map(transaction => (
              <ItemTransaction transaction={transaction} />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  )
}
