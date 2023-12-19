import { Container, Flex, Text } from '@chakra-ui/react'
import React from 'react'

import { InfoIcon } from 'components/icons'

interface IActionHelper {
  title: string
  description: string
}

export const ActionHelper: React.FC<IActionHelper> = ({
  title,
  description,
}) => {
  return (
    <Container variant="primary" maxW={{ base: 'full', md: '290px' }} mt="1rem">
      <Flex justifyContent="space-between" alignItems="center" mb="0.75rem">
        <Text>{title}</Text>
        <InfoIcon />
      </Flex>
      <Text color="gray.900" lineHeight="22px" fontSize="sm">
        {description}
      </Text>
    </Container>
  )
}
