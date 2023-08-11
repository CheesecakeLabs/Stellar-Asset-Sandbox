import { Text, VStack } from '@chakra-ui/react'
import React from 'react'

import { EmptyIcon } from 'components/icons'

interface IEmpty {
  title: string
  hideIcon?: boolean
}

export const Empty: React.FC<IEmpty> = ({ title, hideIcon = false }) => {
  return (
    <VStack
      w="full"
      fill="gray.650"
      _dark={{ fill: 'white' }}
      mt="2rem"
      mb="1rem"
    >
      {!hideIcon && <EmptyIcon />}
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
