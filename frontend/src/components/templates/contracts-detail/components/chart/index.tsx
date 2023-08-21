import { Container, Flex, Text } from '@chakra-ui/react'
import React from 'react'

import { HelpIcon } from 'components/icons'

interface IChart {
  title: string
  value: string
}

export const Chart: React.FC<IChart> = ({ title, value }) => {
  return (
    <Container
      variant="primary"
      justifyContent="center"
      py="0.5rem"
      px="0.75rem"
      w="full"
      maxW="full"
    >
      <Flex justifyContent="flex-end" mb="1.25rem">
        <HelpIcon />
      </Flex>
      <Flex flexDir="column" alignItems="center">
        <Text fontSize="xs" color="gray.650" _dark={{ color: 'white' }}>
          {title}
        </Text>
        <Text fontSize="2xl" mt="0.25rem">
          {value}
        </Text>
      </Flex>
    </Container>
  )
}
