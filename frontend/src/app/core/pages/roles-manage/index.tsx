import { Flex, VStack, useMediaQuery, useToast } from '@chakra-ui/react'
import React, { useEffect } from 'react'

import { useAuth } from 'hooks/useAuth'
import { MessagesError } from 'utils/constants/messages-error'
import { GAService } from 'utils/ga'

import { PathRoute } from 'components/enums/path-route'
import { SettingsOptions } from 'components/enums/settings-options'
import { MenuSettings } from 'components/organisms/menu-settings'
import { Sidebar } from 'components/organisms/sidebar'
import { RolesManageTemplate } from 'components/templates/roles-manage-template'

export const RolesManage: React.FC = () => {
  const [isLargerThanLg] = useMediaQuery('(min-width: 992px)')

  const {
    getRoles,
    createRole,
    updateRole,
    deleteRole,
    getProfile,
    getUserPermissions,
    creatingRole,
    updatingRole,
    roles,
    loadingRoles,
    deletingRole,
    userPermissions
  } = useAuth()

  const toast = useToast()

  useEffect(() => {
    getRoles()
  }, [getRoles])

  useEffect(() => {
    getUserPermissions()
  }, [getUserPermissions])

  const handleRole = async (name: string, id?: number): Promise<boolean> => {
    try {
      const profile = await getProfile()
      if (!profile?.id) throw new Error('Unauthorized user')

      const isSuccess = id
        ? await updateRole(id, name)
        : await createRole(profile.id, name)

      if (isSuccess) {
        toast({
          title: 'Success!',
          description: `Role ${id ? 'updated' : 'created'}!`,
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: 'top-right',
        })
        GAService.GAEvent('role_created')
        getRoles()
        return true
      }
      toastError(MessagesError.errorOccurred)
      return false
    } catch (error) {
      let message
      if (error instanceof Error) message = error.message
      else message = String(error)
      toastError(message)
      return false
    }
  }

  const handleDeleteRole = async (
    id: number,
    idNewUsersRole: number
  ): Promise<boolean> => {
    try {
      const isSuccess = await deleteRole(id, idNewUsersRole)

      if (isSuccess) {
        toast({
          title: 'Success!',
          description: `Role deleted!`,
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: 'top-right',
        })
        GAService.GAEvent('role_deleted')
        getRoles()
        return true
      }
      toastError(MessagesError.errorOccurred)
      return false
    } catch (error) {
      let message
      if (error instanceof Error) message = error.message
      else message = String(error)
      toastError(message)
      return false
    }
  }

  const toastError = (message: string): void => {
    toast({
      title: 'Error!',
      description: message,
      status: 'error',
      duration: 9000,
      isClosable: true,
      position: 'top-right',
    })
  }

  return (
    <Flex>
      <Sidebar highlightMenu={PathRoute.SETTINGS}>
        <Flex
          flexDir={isLargerThanLg ? 'row' : 'column'}
          w="full"
          justifyContent="center"
          gap="1.5rem"
        >
          <Flex maxW="966px" flexDir="column" w="full">
            <RolesManageTemplate
              roles={roles}
              creatingRole={creatingRole}
              updatingRole={updatingRole}
              deletingRole={deletingRole}
              loadingRoles={loadingRoles}
              userPermissions={userPermissions}
              handleDeleteRole={handleDeleteRole}
              handleRole={handleRole}
            />
          </Flex>
          {isLargerThanLg && (
            <VStack>
              <MenuSettings option={SettingsOptions.ROLES_MANAGE} />
            </VStack>
          )}
        </Flex>
      </Sidebar>
    </Flex>
  )
}
