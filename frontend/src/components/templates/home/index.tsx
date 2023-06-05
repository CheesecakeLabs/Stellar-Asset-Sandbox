import { Flex } from '@chakra-ui/react'
import React from 'react'

import { AssetsManagement } from './components/assets-management'
import { LastTransactions } from './components/last-transactions'

export const HomeTemplate: React.FC = () => {
  return (
    <Flex flexDir="column" gap={6}>
      <AssetsManagement />
      <LastTransactions />
    </Flex>
  )
}
