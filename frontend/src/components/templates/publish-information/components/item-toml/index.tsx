import { Box, Flex, SimpleGrid, Text } from '@chakra-ui/react'
import React, { ReactNode } from 'react'

interface IItemToml {
  title: string
  description: string
  children: ReactNode
}

export const ItemToml: React.FC<IItemToml> = ({
  title,
  description,
  children,
}) => {
  return (
    <Flex
      borderBottom="1px solid"
      borderColor="gray.600"
      py="1rem"
      px="0.5rem"
      alignItems="center"
      _dark={{ borderColor: 'gray.800' }}
    >
      <SimpleGrid
        columns={{ base: 1, md: 2 }}
        minChildWidth={{ base: '100%', md: '50%' }}
        alignItems="center"
        w="100%"
      >
        <Box>
          <Text mr="1rem" mb="0.25rem">
            {title}
          </Text>
          <Text mr="1rem" fontSize="sm">
            {description}
          </Text>
        </Box>
        {children}
      </SimpleGrid>
    </Flex>
  )
}
