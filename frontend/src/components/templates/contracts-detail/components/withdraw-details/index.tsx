import { Flex, Text } from '@chakra-ui/react'
import React from 'react'

import { ContractHistory } from '../contract-history'

interface IWithdrawDetails {
  contract: Hooks.UseContractsTypes.IContract
  contractData: Hooks.UseContractsTypes.IContractData | undefined
  history: Hooks.UseContractsTypes.IHistory[] | undefined
}

export const WithdrawDetails: React.FC<IWithdrawDetails> = ({
  contract,
  contractData,
  history,
}) => {

  return (
    <Flex flexDir="column" w="full">
      <Text fontSize="sm" mb="0.5rem" ms="0.25rem">
        Deposit info
      </Text>
      <Flex
        flexDir="column"
        w="full"
        maxW="full"
        gap="0.75rem"
        mt="0.5rem"
        borderRadius="0.25rem"
        p="1rem"
      >
        {contractData && (
          <Flex w="full" flexDir="column">
            <ContractHistory contract={contract} history={history} />
          </Flex>
        )}
      </Flex>
    </Flex>
  )
}
