import { Container, Flex, Text, Tooltip } from '@chakra-ui/react'
import React, { ReactNode } from 'react'

import { HelpIcon } from 'components/icons'

interface IInfoCard {
  title: string
  icon?: ReactNode
  value: string
  helper?: string
}

export const InfoCard: React.FC<IInfoCard> = ({
  title,
  icon,
  value,
  helper,
}) => {
  return (
    <Container
      variant="primary"
      justifyContent="center"
      py="0.5rem"
      px="0.75rem"
      w="full"
      maxW="full"
    >
      <Flex justifyContent="space-between" mb="1.25rem">
        <Text fontSize="xs" fontWeight="600">
          {title}
        </Text>
        <Flex>
          {helper && (
            <Tooltip label={helper}>
              <HelpIcon width="20px" />
            </Tooltip>
          )}
        </Flex>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center">
        {icon}
        <Text fontSize="xl">{value}</Text>
      </Flex>
    </Container>
  )
}
