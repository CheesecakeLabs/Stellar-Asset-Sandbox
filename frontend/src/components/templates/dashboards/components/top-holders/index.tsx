import {
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

import { toCrypto } from 'utils/formatter'

interface ITopHolders {
  holders: Hooks.UseHorizonTypes.IHolder[] | undefined
  assetCode: string
}

export const TopHolders: React.FC<ITopHolders> = ({ holders }) => {
  return (
    <Container
      justifyContent="center"
      py="0.5rem"
      px={0}
      w="full"
      maxW="full"
      mt="1rem"
    >
      <Flex justifyContent="space-between" mb="1.25rem">
        <Text fontSize="xs" fontWeight="600">
          Top holders
        </Text>
      </Flex>
      <Table size="sm" variant="list">
        <Thead>
          <Th pe={0}></Th>
          <Th>Holder</Th>
          <Th>Amount</Th>
        </Thead>
        <Tbody>
          {holders?.map((holder, index) => (
            <Tr>
              <Td pe={0}>{index + 1}</Td>
              <Td>{holder.name}</Td>
              <Td fontSize="sm">{toCrypto(holder.amount)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Container>
  )
}
