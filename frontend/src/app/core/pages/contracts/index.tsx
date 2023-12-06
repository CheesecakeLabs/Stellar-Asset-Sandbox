import { Flex } from '@chakra-ui/react'
import React, { useEffect } from 'react'

import { useAuth } from 'hooks/useAuth'
import { useContracts } from 'hooks/useContracts'

import { PathRoute } from 'components/enums/path-route'
import { Sidebar } from 'components/organisms/sidebar'
import { ContractsTemplate } from 'components/templates/contracts'

export const Contracts: React.FC = () => {
  const { loading, getContracts, contracts } = useContracts()
  const { userPermissions, getUserPermissions } = useAuth()

  useEffect(() => {
    getContracts()
  }, [getContracts])

  useEffect(() => {
    getUserPermissions()
  }, [getUserPermissions])

  return (
    <Flex>
      <Sidebar highlightMenu={PathRoute.SOROBAN_SMART_CONTRACTS}>
        <ContractsTemplate
          loading={loading}
          contracts={contracts}
          userPermissions={userPermissions}
        />
      </Sidebar>
    </Flex>
  )
}
