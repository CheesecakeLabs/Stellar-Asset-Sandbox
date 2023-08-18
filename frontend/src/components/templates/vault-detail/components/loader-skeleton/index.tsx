import { Skeleton, Flex, HStack } from '@chakra-ui/react'
import React from 'react'

export const LoaderSkeleton: React.FC = () => {
  return (
    <>
      <Flex alignItems="center" mb="1.5rem">
        <Skeleton h="2rem" w="6rem" />
        <Skeleton h="2rem" ms="1rem" w="4rem" />
      </Flex>
      <HStack gap="1rem">
        <Skeleton h="10rem" w="full" />
        <Skeleton h="10rem" w="full" />
      </HStack>
    </>
  )
}
