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

export const TopHolders: React.FC<ITopHolders> = ({ holders, assetCode }) => {
  return (
    <Container
      justifyContent="center"
      py="0.5rem"
      px={0}
      w="full"
      maxW="full"
      mt="0.5rem"
    >
      <Flex justifyContent="space-between" mb="1.25rem" ms="0.5rem">
        <Text fontSize="xs" fontWeight="600">
          Top holders
        </Text>
      </Flex>
      <Table size="sm">
        <Thead>
          <Th>Holder</Th>
          <Th isNumeric>Amount</Th>
        </Thead>
        <Tbody>
          {holders?.map((holder, index) => (
            <Tr py="2rem" key={index}>
              <Td>{holder.name}</Td>
              <Td fontSize="sm" isNumeric>
                {toCrypto(holder.amount)} {assetCode}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Container>
  )
}
