import { Container, Text, Flex, Progress } from '@chakra-ui/react'
import React from 'react'

import { toCrypto } from 'utils/formatter'

import { HelpIcon } from 'components/icons'

interface IBalanceChart {
  supply: number
  mainVault: number
  assetCode: string
}

export const BalanceChart: React.FC<IBalanceChart> = ({
  supply,
  mainVault,
  assetCode,
}) => {
  return (
    <Container
      variant="primary"
      justifyContent="center"
      py="0.5rem"
      px="0.75rem"
      w="full"
      maxW="full"
      mt="1rem"
    >
      <Flex justifyContent="space-between" mb="1.25rem">
        <Text fontSize="xs" fontWeight="600">
          Balance in the Main Vault 
        </Text>
        <Flex>
          <HelpIcon />
        </Flex>
      </Flex>

      <Flex flexDir="column" gap={2} mb="1rem">
        <Text textAlign="center">
          {`${toCrypto(mainVault)} ${assetCode}`} /{' '}
          {`${toCrypto(supply)} ${assetCode}`}
        </Text>
        <Progress
          value={supply !== 0 ? ((mainVault) / supply) * 100 : 0}
          h="1rem"
          borderRadius="0.5rem"
          colorScheme="purple"
        />
      </Flex>
    </Container>
  )
}
