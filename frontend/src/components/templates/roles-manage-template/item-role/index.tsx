import { Button, Flex, Td, Tr, useDisclosure } from '@chakra-ui/react'
import React from 'react'

import { DeleteIcon } from 'components/icons'

import { ModalRoleDelete } from '../modal-role-delete'
import { ModalRoleManage } from '../modal-role-manage'

interface IItemRole {
  role: Hooks.UseAuthTypes.IRole
  roles: Hooks.UseAuthTypes.IRole[] | undefined
  loading: boolean
  loadingRoles: boolean
  handleRole(name: string, id?: number): Promise<boolean>
  handleDeleteRole(id: number, idNewUsersRole: number): Promise<boolean>
}

export const ItemRole: React.FC<IItemRole> = ({
  role,
  roles,
  loading,
  loadingRoles,
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
            <Button variant="secondary" onClick={onOpenUpdate}>
              Rename
            </Button>
            <Button variant="primary" onClick={onOpenDelete} bg="red.500">
              <DeleteIcon />
            </Button>
          </Flex>
        </Td>
      </Tr>
    </>
  )
}
