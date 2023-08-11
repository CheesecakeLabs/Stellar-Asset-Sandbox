import { Flex } from '@chakra-ui/react'
import React, { useEffect } from 'react'

import { useVaults } from 'hooks/useVaults'

import { PathRoute } from 'components/enums/path-route'
import { Sidebar } from 'components/organisms/sidebar'
import { VaultsTemplate } from 'components/templates/vaults'

export const Vaults: React.FC = () => {
  const { loadingVaults, getVaults, vaults } = useVaults()

  useEffect(() => {
    getVaults()
  }, [getVaults])

  return (
    <Flex>
      <Sidebar highlightMenu={PathRoute.VAULTS}>
        <VaultsTemplate loading={loadingVaults} vaults={vaults} />
      </Sidebar>
    </Flex>
  )
}
