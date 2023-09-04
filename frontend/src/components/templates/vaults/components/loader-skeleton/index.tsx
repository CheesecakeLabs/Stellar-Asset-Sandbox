import { Skeleton, SimpleGrid } from '@chakra-ui/react'
import React from 'react'

export const LoaderSkeleton: React.FC = () => {
  return (
    <SimpleGrid columns={{ xl: 4, md: 3, sm: 2 }} spacing={5}>
      <Skeleton height="8rem" />
      <Skeleton height="8rem" />
      <Skeleton height="8rem" />
      <Skeleton height="8rem" />
      <Skeleton height="8rem" />
      <Skeleton height="8rem" />
      <Skeleton height="8rem" />
      <Skeleton height="8rem" />
    </SimpleGrid>
  )
}
