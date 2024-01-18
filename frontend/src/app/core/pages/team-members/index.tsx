import { Flex, VStack, useMediaQuery } from '@chakra-ui/react'
import React, { useEffect } from 'react'

import { useAuth } from 'hooks/useAuth'
import { GAService } from 'utils/ga'

import { PathRoute } from 'components/enums/path-route'
import { SettingsOptions } from 'components/enums/settings-options'
import { MenuSettings } from 'components/organisms/menu-settings'
import { Sidebar } from 'components/organisms/sidebar'
import { TeamMembersTemplate } from 'components/templates/team-members'

export const TeamMembers: React.FC = () => {
  const [isLargerThanMd] = useMediaQuery('(min-width: 768px)')

  const {
    getAllUsers,
    editUsersRole,
    getRoles,
    getUserPermissions,
    users,
    loading,
    roles,
    loadingRoles,
    userPermissions,
    loadingUserPermissions,
  } = useAuth()

  useEffect(() => {
    GAService.GAPageView('Administration')
  }, [])

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
    getUserPermissions()
  }, [getAllUsers, getRoles, getUserPermissions])

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
            <TeamMembersTemplate
              users={users}
              loading={loading || loadingUserPermissions}
              handleEditRole={handleEditRole}
              roles={roles}
              loadingRoles={loadingRoles}
              permissions={userPermissions}
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
