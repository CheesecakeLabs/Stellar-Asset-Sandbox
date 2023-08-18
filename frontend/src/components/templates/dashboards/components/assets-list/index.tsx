import { Text, Container, Flex, Box } from '@chakra-ui/react'
import React from 'react'

import { getCurrencyIcon } from 'utils/constants/constants'
import { toCrypto } from 'utils/formatter'

import { HelpIcon } from 'components/icons'

interface IAssetsList {
  height?: number
  label?: string
}

export const AssetsList: React.FC<IAssetsList> = () => {
  return (
    <Container
      variant="primary"
      justifyContent="center"
      py="0.5rem"
      px="0.75rem"
      w="full"
      maxW="280px"
      mt="1rem"
    >
      <Flex justifyContent="space-between" mb="1.25rem">
        <Text
          fontSize="xs"
          fontWeight="600"
          color="gray.650"
          _dark={{ color: 'white' }}
        >
          Assets
        </Text>
        <Flex>
          <HelpIcon />
        </Flex>
      </Flex>
      <Flex
        alignItems="center"
        px="0.5rem"
        pb="0.5rem"
        mb="0.5rem"
        borderBottom="1px solid"
        borderColor={'gray.600'}
        _dark={{ borderColor: 'black.800' }}
      >
        <Box w="2rem">{getCurrencyIcon('USDC', '1.5rem')}</Box>
        <Flex ms="0.75rem" flexDir="column" w="full">
          <Text fontSize="sm" fontWeight="700">
            USDC
          </Text>
          <Text fontSize="xs">{toCrypto(384923)} USDC</Text>
        </Flex>
        <Text fontSize="sm" fontWeight="700" color="green">
          +1,42%
        </Text>
      </Flex>

      <Flex
        alignItems="center"
        px="0.5rem"
        pb="0.5rem"
        mb="0.5rem"
        borderBottom="1px solid"
        borderColor={'gray.600'}
        _dark={{ borderColor: 'black.800' }}
      >
        <Box w="2rem">{getCurrencyIcon('EUROC', '1.5rem')}</Box>
        <Flex ms="0.75rem" flexDir="column" w="full">
          <Text fontSize="sm" fontWeight="700">
            EUROC
          </Text>
          <Text fontSize="xs">{toCrypto(384923)} EUROC</Text>
        </Flex>
        <Text fontSize="sm" fontWeight="700" color="green">
          +0,64%
        </Text>
      </Flex>

      <Flex
        alignItems="center"
        px="0.5rem"
        pb="0.5rem"
        mb="0.5rem"
        borderBottom="1px solid"
        borderColor={'gray.600'}
        _dark={{ borderColor: 'black.800' }}
      >
        <Box w="2rem">{getCurrencyIcon('ARS', '1.5rem')}</Box>
        <Flex ms="0.75rem" flexDir="column" w="full">
          <Text fontSize="sm" fontWeight="700">
            ARS
          </Text>
          <Text fontSize="xs">{toCrypto(384923)} ARS</Text>
        </Flex>
        <Text fontSize="sm" fontWeight="700" color="red">
          -5,21%
        </Text>
      </Flex>
    </Container>
  )
}
