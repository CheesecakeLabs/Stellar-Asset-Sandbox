import { Flex } from '@chakra-ui/react'
import React from 'react'

interface ITopHolders {
  holders: Hooks.UseHorizonTypes.IHolder[] | undefined
}

export const TopHolders: React.FC<ITopHolders> = ({ holders }) => {
  return (
    <Flex flexDir="column">
      {holders?.map(holder => (
        <Flex>
          {holder.name} - {holder.amount} - {holder.percentage}
        </Flex>
      ))}
    </Flex>
  )
}
