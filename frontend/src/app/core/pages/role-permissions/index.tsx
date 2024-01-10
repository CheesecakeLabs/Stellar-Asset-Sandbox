import { Flex, VStack, useMediaQuery, useToast } from '@chakra-ui/react'
import React, { useCallback, useEffect, useState } from 'react'

import { useAuth } from 'hooks/useAuth'
import { MessagesError } from 'utils/constants/messages-error'

import { PathRoute } from 'components/enums/path-route'
import { SettingsOptions } from 'components/enums/settings-options'
import { MenuSettings } from 'components/organisms/menu-settings'
import { Sidebar } from 'components/organisms/sidebar'
import { RolePermissionsTemplate } from 'components/templates/role-permissions-template'
import { GAService } from 'utils/ga'

export interface IChange {
  role_id: number
  permission_id: number
  is_add: boolean
}

export const RolePermissions: React.FC = () => {
  const [isLargerThanMd] = useMediaQuery('(min-width: 768px)')
  const [changes, setChanges] = useState<IChange[]>([])
  const [loading, setLoading] = useState(true)

  const {
    getRoles,
    getUserPermissions,
    getPermissions,
    getRolesPermissions,
    updateRolesPermissions,
    roles,
    userPermissions,
    permissions,
    rolesPermissions,
    updatingRolesPermissions,
  } = useAuth()

  const toast = useToast()

  const loadData = useCallback(async (): Promise<void> => {
    setLoading(true)
    await getRoles()
    await getUserPermissions()
    await getPermissions()
    await getRolesPermissions()
    setLoading(false)
  }, [getPermissions, getRoles, getRolesPermissions, getUserPermissions])

  useEffect(() => {
    loadData()
  }, [loadData])

  const onSubmit = async (
    params: Hooks.UseAuthTypes.IRolePermission[]
  ): Promise<void> => {
    try {
      const isSuccess = await updateRolesPermissions(params)

      if (isSuccess) {
        toast({
          title: 'Success!',
          description: `Roles permissions updated!`,
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: 'top-right',
        })
        GAService.GAEvent('role_permissions_changed')
        setChanges([])
        getRolesPermissions()
        return
      }
      toastError(MessagesError.errorOccurred)
    } catch (error) {
      let message
      if (error instanceof Error) message = error.message
      else message = String(error)
      toastError(message)
    }
  }

  const toastError = (message: string): void => {
    toast({
      title: 'Mint error!',
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
          flexDir={isLargerThanMd ? 'row' : 'column'}
          w="full"
          justifyContent="center"
          gap="1.5rem"
        >
          <Flex maxW="966px" flexDir="column" w="full">
            <RolePermissionsTemplate
              loading={loading}
              roles={roles}
              userPermissions={userPermissions}
              permissions={permissions}
              rolesPermissions={rolesPermissions}
              updatingRolesPermissions={updatingRolesPermissions}
              changes={changes}
              onSubmit={onSubmit}
              setChanges={setChanges}
            />
          </Flex>
          <VStack>
            <MenuSettings option={SettingsOptions.ROLE_PERMISSIONS} />
          </VStack>
        </Flex>
      </Sidebar>
    </Flex>
  )
}
