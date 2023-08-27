import { Flex, VStack } from '@chakra-ui/react'
import React, { useEffect } from 'react'

import { useAuth } from 'hooks/useAuth'

import { PathRoute } from 'components/enums/path-route'
import { SettingsOptions } from 'components/enums/settings-options'
import { MenuSettings } from 'components/organisms/menu-settings'
import { Sidebar } from 'components/organisms/sidebar'
import { PermissionsTemplate } from 'components/templates/permissions-template'

export const Permissions: React.FC = () => {
  const {
    getRoles,
    getPermissions,
    loading,
    roles,
    loadingRoles,
    permissions,
  } = useAuth()

  useEffect(() => {
    getRoles()
    getPermissions()
  }, [getRoles, getPermissions])

  return (
    <Flex>
      <Sidebar highlightMenu={PathRoute.TEAM_MEMBERS}>
        <Flex flexDir="row" w="full" justifyContent="center" gap="1.5rem">
          <Flex maxW="966px" flexDir="column" w="full">
            <PermissionsTemplate
              loading={loading}
              roles={roles}
              loadingRoles={loadingRoles}
              permissions={permissions}
            />
          </Flex>
          <VStack>
            <MenuSettings option={SettingsOptions.PERMISSIONS} />
          </VStack>
        </Flex>
      </Sidebar>
    </Flex>
  )
}
