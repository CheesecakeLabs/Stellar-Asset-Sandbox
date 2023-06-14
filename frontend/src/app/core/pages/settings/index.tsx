import { Flex } from '@chakra-ui/react'
import React, { useEffect } from 'react'

import { useAuth } from 'hooks/useAuth'

import { Sidebar } from 'components/organisms/sidebar'
import { SettingsTemplate } from 'components/templates/settings'

export const Settings: React.FC = () => {
  const {
    getAllUsers,
    users,
    loading,
    updateUserRole,
    getRoles,
    roles,
    loadingRoles,
  } = useAuth()

  const handleEditRole = async (
    params: Hooks.UseAuthTypes.IUserRole
  ): Promise<boolean> => {
    const isEdited = await updateUserRole(params)

    if (isEdited) {
      getAllUsers()
      return true
    }
    return false
  }

  useEffect(() => {
    getAllUsers()
    getRoles()
  }, [getAllUsers, getRoles])

  return (
    <Flex>
      <Sidebar>
        <SettingsTemplate
          users={users}
          loading={loading}
          handleEditRole={handleEditRole}
          roles={roles}
          loadingRoles={loadingRoles}
        />
      </Sidebar>
    </Flex>
  )
}
