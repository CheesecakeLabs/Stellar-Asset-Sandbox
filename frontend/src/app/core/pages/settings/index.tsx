import { Flex } from '@chakra-ui/react'
import React, { useEffect } from 'react'

import { useAuth } from 'hooks/useAuth'

import { PathRoute } from 'components/enums/path-route'
import { Sidebar } from 'components/organisms/sidebar'
import { SettingsTemplate } from 'components/templates/settings'

export const Settings: React.FC = () => {
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
      <Sidebar highlightMenu={PathRoute.SETTINGS}>
        <SettingsTemplate
          users={users}
          loading={loading}
          handleEditRole={handleEditRole}
          roles={roles}
          loadingRoles={loadingRoles}
          permissions={permissions}
        />
      </Sidebar>
    </Flex>
  )
}
