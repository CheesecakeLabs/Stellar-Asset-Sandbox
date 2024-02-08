import { Flex, VStack, useMediaQuery } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'

import { useAuth } from 'hooks/useAuth'
import { useTransactions } from 'hooks/useTransactions'
import { GAService } from 'utils/ga'

import { PathRoute } from 'components/enums/path-route'
import { SettingsOptions } from 'components/enums/settings-options'
import { MenuSettings } from 'components/organisms/menu-settings'
import { Sidebar } from 'components/organisms/sidebar'
import { CostCenterTemplate } from 'components/templates/cost-center'
import { RolesManageTemplate } from 'components/templates/roles-manage-template'

export const CostCenter: React.FC = () => {
  const [isLargerThanMd] = useMediaQuery('(min-width: 768px)')
  const { userPermissions, getUserPermissions } = useAuth()
  const { getSponsorPK } = useTransactions()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    GAService.GAPageView('Coast center')
  }, [])

  useEffect(() => {
    getUserPermissions()
    getSponsorPK().then(sponsor => console.log(sponsor))
  }, [getUserPermissions])

  return (
    <Flex>
      <Sidebar highlightMenu={PathRoute.SETTINGS}>
        <Flex
          flexDir={isLargerThanMd ? 'row' : 'column'}
          w="full"
          justifyContent="center"
          gap="1.5rem"
        >
          <Flex maxW="966px" flexDir="column" w="full">
            <CostCenterTemplate
              loading={loading}
              transactions={[]}
              userPermissions={userPermissions}
            />
          </Flex>
          {isLargerThanMd && (
            <VStack>
              <MenuSettings option={SettingsOptions.COST_CENTER} />
            </VStack>
          )}
        </Flex>
      </Sidebar>
    </Flex>
  )
}
