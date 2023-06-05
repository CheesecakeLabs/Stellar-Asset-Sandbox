import { Flex } from '@chakra-ui/react'
import React from 'react'

import { AssetsManagement } from './components/assets-management'

export const HomeTemplate: React.FC = () => {
  return (
    <Flex>
      <AssetsManagement />
    </Flex>
  )
}
