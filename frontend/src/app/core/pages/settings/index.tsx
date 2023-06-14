import { Flex } from '@chakra-ui/react'
import React from 'react'

import { Sidebar } from 'components/organisms/sidebar'
import { SettingsTemplate } from 'components/templates/settings'

export const Settings: React.FC = () => {
  return (
    <Flex>
      <Sidebar>
        <SettingsTemplate />
      </Sidebar>
    </Flex>
  )
}
