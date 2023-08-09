import { Flex } from '@chakra-ui/react'
import React, { useEffect } from 'react'

import { useContracts } from 'hooks/useContracts'

import { PathRoute } from 'components/enums/path-route'
import { Sidebar } from 'components/organisms/sidebar'
import { ContractsTemplate } from 'components/templates/contracts'

export const Contracts: React.FC = () => {
  const { loading, getContracts, contracts } = useContracts()

  useEffect(() => {
    getContracts()
  }, [getContracts])

  return (
    <Flex>
      <Sidebar highlightMenu={PathRoute.SOROBAN_SMART_CONTRACTS}>
        <ContractsTemplate loading={loading} contracts={contracts} />
      </Sidebar>
    </Flex>
  )
}
