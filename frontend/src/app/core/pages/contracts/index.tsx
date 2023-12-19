import { Flex } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'

import { useAuth } from 'hooks/useAuth'
import { useContracts } from 'hooks/useContracts'

import { PathRoute } from 'components/enums/path-route'
import { Sidebar } from 'components/organisms/sidebar'
import { ContractsTemplate } from 'components/templates/contracts'

export const Contracts: React.FC = () => {
  const { getPagedContracts } = useContracts()
  const { userPermissions, getUserPermissions } = useAuth()
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [pagedContracts, setPagedContracts] =
    useState<Hooks.UseContractsTypes.IPagedContracts>()

  const LIMIT = 10

  useEffect(() => {
    getPagedContracts({
      page: currentPage,
      limit: LIMIT,
    }).then(pagedContracts => {
      setPagedContracts(pagedContracts)
      setLoading(false)
    })
  }, [getPagedContracts, currentPage])

  useEffect(() => {
    getUserPermissions()
  }, [getUserPermissions])

  const changePage = (pageSelected: number): void => {
    setLoading(true)
    getPagedContracts({
      page: pageSelected,
      limit: LIMIT,
    }).then(pagedContracts => {
      setPagedContracts(pagedContracts)
      setLoading(false)
      setCurrentPage(pageSelected)
    })
  }

  return (
    <Flex>
      <Sidebar highlightMenu={PathRoute.SOROBAN_SMART_CONTRACTS}>
        <ContractsTemplate
          loading={loading}
          contracts={pagedContracts?.contracts}
          userPermissions={userPermissions}
          currentPage={currentPage}
          totalPages={pagedContracts?.totalPages || 1}
          changePage={changePage}
        />
      </Sidebar>
    </Flex>
  )
}
