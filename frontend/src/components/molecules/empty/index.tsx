import { Text, VStack } from '@chakra-ui/react'
import React from 'react'

import { EmptyIcon } from 'components/icons'

interface IEmpty {
  title: string
}

export const Empty: React.FC<IEmpty> = ({ title }) => {
  return (
    <VStack w="full" fill="gray.650" _dark={{ fill: 'white' }} mt="2rem">
      <EmptyIcon />
      <Text
        fontWeight="700"
        fontSize="sm"
        color="gray.650"
        _dark={{ color: 'white' }}
      >
        {title}
      </Text>
    </VStack>
  )
}
