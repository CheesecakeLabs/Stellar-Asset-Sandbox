import { Flex, VStack } from '@chakra-ui/react'
import React, { useEffect } from 'react'

import { useAuth } from 'hooks/useAuth'

import { PathRoute } from 'components/enums/path-route'
import { SettingsOptions } from 'components/enums/settings-options'
import { MenuSettings } from 'components/organisms/menu-settings'
import { Sidebar } from 'components/organisms/sidebar'
import { TeamMembersTemplate } from 'components/templates/team-members'

export const TeamMembers: React.FC = () => {
  const {
    getAllUsers,
    editUsersRole,
    getRoles,
    getPermissions,
    users,
    loading,
    roles,
    loadingRoles,
    permissions,
  } = useAuth()

  const handleEditRole = async (
    params: Hooks.UseAuthTypes.IUserRole
  ): Promise<boolean> => {
    const isEdited = await editUsersRole(params)

    if (isEdited) {
      getAllUsers()
      return true
    }
    return false
  }

  useEffect(() => {
    getAllUsers()
    getRoles()
    getPermissions()
  }, [getAllUsers, getRoles, getPermissions])

  return (
    <Flex>
      <Sidebar highlightMenu={PathRoute.TEAM_MEMBERS}>
        <Flex flexDir="row" w="full" justifyContent="center" gap="1.5rem">
          <Flex maxW="966px" flexDir="column" w="full">
            <TeamMembersTemplate
              users={users}
              loading={loading}
              handleEditRole={handleEditRole}
              roles={roles}
              loadingRoles={loadingRoles}
              permissions={permissions}
            />
          </Flex>
          <VStack>
            <MenuSettings option={SettingsOptions.TEAM_MEMBERS} />
          </VStack>
        </Flex>
      </Sidebar>
    </Flex>
  )
}
