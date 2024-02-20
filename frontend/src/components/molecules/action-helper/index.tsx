import { Container, Flex, Text } from '@chakra-ui/react'
import React, { ReactNode } from 'react'

import { InfoIcon } from 'components/icons'

interface IActionHelper {
  title: string
  description?: string
  children?: ReactNode
}

export const ActionHelper: React.FC<IActionHelper> = ({
  title,
  description,
  children,
}) => {
  return (
    <Container variant="primary" maxW={{ base: 'full', md: '290px' }} mt="1rem">
      <Flex justifyContent="space-between" alignItems="center" mb="0.75rem">
        <Text>{title}</Text>
        <InfoIcon />
      </Flex>
      {children ? (
        children
      ) : (
        <Text color="gray.900" lineHeight="22px" fontSize="sm">
          {description}
        </Text>
      )}
    </Container>
  )
}
