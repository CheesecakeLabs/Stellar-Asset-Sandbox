import { Flex, Text } from '@chakra-ui/react'
import React, { ReactNode } from 'react'

interface IItemContractData {
  title: string
  icon: ReactNode
  value?: string
  children?: ReactNode
}

export const ItemContractData: React.FC<IItemContractData> = ({
  title,
  icon,
  value,
  children,
}) => {
  return (
    <Flex justifyContent="space-between" w="full">
      <Flex gap="0.75rem" alignItems="center" me="2rem">
        {icon}
        <Text fontSize="sm">{title}</Text>
      </Flex>
      {children ? children : <Text fontSize="sm">{value}</Text>}
    </Flex>
  )
}
