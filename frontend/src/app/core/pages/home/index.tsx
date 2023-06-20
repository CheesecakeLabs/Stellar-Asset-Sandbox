import { Flex } from '@chakra-ui/react'
import React from 'react'

import { mockupAssets } from 'utils/mockups'

import { Sidebar } from 'components/organisms/sidebar'
import { HomeTemplate } from 'components/templates/home'

export const Home: React.FC = () => {
  return (
    <Flex>
      <Sidebar>
        <HomeTemplate loading={false} assets={mockupAssets} />
      </Sidebar>
    </Flex>
  )
}
