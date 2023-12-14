import { Flex, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'
import React from 'react'

import { formatDateFullClean, toCrypto } from 'utils/formatter'

interface IWithdrawDetails {
  contract: Hooks.UseContractsTypes.IContract
  history: Hooks.UseContractsTypes.IHistory[] | undefined
}

export const ContractHistory: React.FC<IWithdrawDetails> = ({
  contract,
  history,
}) => {
  const calculateVariation = (
    depositAmount: number,
    withdrawAmount: number
  ): string => {
    const variation = ((withdrawAmount - depositAmount) / depositAmount) * 100
    return `+${variation.toFixed(2)}%`
  }

  return (
    <Flex>
      <Flex flexDir="column" w="full"
          overflowX="auto">
        <Text
          bg="gray.100"
          borderRadius="full"
          fontWeight="bold"
          fontSize="xs"
          px="0.75rem"
          py="0.25rem"
          w="fit-content"
          mb="0.15rem"
          _dark={{ bg: 'black.800', color: 'white' }}
        >
          Your history
        </Text>
        <Table variant="small" mt="0.25rem">
          <Thead>
            <Tr>
              <Th>Date of deposit</Th>
              <Th>Deposited</Th>
              <Th>Date of withdraw</Th>
              <Th>Withdrawn</Th>
            </Tr>
          </Thead>
          <Tbody>
            {history?.map((itemHistory, index) => (
              <Tr key={index}>
                <Td>{formatDateFullClean(itemHistory.deposited_at)}</Td>
                <Td>{`${toCrypto(itemHistory.deposit_amount)} ${
                  contract.asset.code
                }`}</Td>
                <Td>
                  {itemHistory.withdrawn_at
                    ? formatDateFullClean(itemHistory.withdrawn_at)
                    : '-'}
                </Td>
                <Td>
                  <Flex alignItems="center" gap="0.5rem">
                    {itemHistory.withdraw_amount
                      ? `${toCrypto(itemHistory.withdraw_amount)} ${
                          contract.asset.code
                        }`
                      : '-'}
                    {itemHistory.withdraw_amount && (
                      <Text
                        fontSize="xs"
                        bg="#e0eaf9"
                        py="0.15rem"
                        px="0.35rem"
                        mt="0.25rem"
                        borderRadius="full"
                        color="purple.600"
                        w="fit-content"
                        _dark={{ bg: 'black.800', color: 'white' }}
                      >
                        {calculateVariation(
                          itemHistory.deposit_amount,
                          itemHistory.withdraw_amount
                        )}
                      </Text>
                    )}
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        {history && history.length == 0 && (
          <Text
            variant="secondary"
            w="full"
            fontSize="sm"
            fontWeight="600"
            textAlign="center"
            mt="0.5rem"
          >
            You have not made any transactions on this contract yet
          </Text>
        )}
      </Flex>
    </Flex>
  )
}
