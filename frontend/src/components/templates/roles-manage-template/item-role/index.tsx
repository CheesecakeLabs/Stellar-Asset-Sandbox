import { Button, Flex, Td, Tr, useDisclosure } from '@chakra-ui/react'
import React from 'react'

import { DeleteIcon } from 'components/icons'

import Authentication from 'app/auth/services/auth'

import { ModalRoleDelete } from '../modal-role-delete'
import { ModalRoleManage } from '../modal-role-manage'

interface IItemRole {
  role: Hooks.UseAuthTypes.IRole
  roles: Hooks.UseAuthTypes.IRole[] | undefined
  loading: boolean
  loadingRoles: boolean
  userPermissions: Hooks.UseAuthTypes.IUserPermission | undefined
  handleRole(name: string, id?: number): Promise<boolean>
  handleDeleteRole(id: number, idNewUsersRole: number): Promise<boolean>
}

export const ItemRole: React.FC<IItemRole> = ({
  role,
  roles,
  loading,
  loadingRoles,
  userPermissions,
  handleRole,
  handleDeleteRole,
}) => {
  const {
    isOpen: isOpenUpdate,
    onOpen: onOpenUpdate,
    onClose: onCloseUpdate,
  } = useDisclosure()

  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure()

  const isDisabled = (role: Hooks.UseAuthTypes.IRole): boolean => {
    if (userPermissions?.admin) {
      return false
    }
    return role.created_by != Authentication.getUser()?.id
  }

  return (
    <>
      <ModalRoleManage
        isOpen={isOpenUpdate}
        loading={loading}
        role={role}
        isUpdate={true}
        onClose={onCloseUpdate}
        handleRole={handleRole}
      />
      <ModalRoleDelete
        isOpen={isOpenDelete}
        loading={loading}
        loadingRoles={loadingRoles}
        roles={roles}
        role={role}
        onClose={onCloseDelete}
        handleDeleteRole={handleDeleteRole}
      />
      <Tr>
        <Td>{role.name}</Td>
        <Td>
          <Flex w="full" justifyContent="flex-end" gap={2}>
            <Button
              variant="secondary"
              onClick={onOpenUpdate}
              title={
                isDisabled(role) ? 'You can only edit roles you created' : ''
              }
              isDisabled={isDisabled(role)}
            >
              Rename
            </Button>
            <Button
              variant="primary"
              onClick={onOpenDelete}
              bg="red.500"
              title={
                isDisabled(role) ? 'You can only edit roles you created' : ''
              }
              isDisabled={isDisabled(role)}
            >
              <DeleteIcon />
            </Button>
          </Flex>
        </Td>
      </Tr>
    </>
  )
}
