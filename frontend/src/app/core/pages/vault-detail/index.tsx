import { Flex } from '@chakra-ui/react'
import React from 'react'
import { useLocation } from 'react-router-dom'

import { PathRoute } from 'components/enums/path-route'
import { Sidebar } from 'components/organisms/sidebar'
import { VaultDetailTemplate } from 'components/templates/vault-detail'

export const VaultDetail: React.FC = () => {
  const location = useLocation()
  const vault = location.state

  return (
    <Flex>
      <Sidebar highlightMenu={PathRoute.VAULTS}>
        <VaultDetailTemplate vault={vault} />
      </Sidebar>
    </Flex>
  )
}
