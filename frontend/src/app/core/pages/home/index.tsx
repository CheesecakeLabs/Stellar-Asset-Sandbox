import { Flex } from '@chakra-ui/react'
import React from 'react'

import { Sidebar } from 'components/organisms/sidebar'
import { HomeTemplate } from 'components/templates/home'

export const Home: React.FC = () => {
  return (
    <Flex bg="gray.200">
      <Sidebar>
        <HomeTemplate />
      </Sidebar>
    </Flex>
  )
}
