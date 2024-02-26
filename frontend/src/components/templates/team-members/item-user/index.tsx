import { Td, Tr, useDisclosure } from '@chakra-ui/react'
import React from 'react'

import { formatName } from 'utils/formatter'

import { ModalEditRole } from 'components/molecules'

import { ItemMenu } from '../item-menu'
import { ModalUpdateUsername } from '../modal-update-username'

interface IItemUser {
  user: Hooks.UseAuthTypes.IUserDto
  loading: boolean
  updatingUsername: boolean
  roles: Hooks.UseAuthTypes.IRole[] | undefined
  loadingRoles: boolean
  permissions: Hooks.UseAuthTypes.IUserPermission | undefined
  handleEditRole(params: Hooks.UseAuthTypes.IUserRole): Promise<boolean>
  handleUpdateUsername(id: number, name: string): Promise<boolean>
}

export const ItemUser: React.FC<IItemUser> = ({
  user,
  loading,
  roles,
  loadingRoles,
  permissions,
  updatingUsername,
  handleEditRole,
  handleUpdateUsername,
}) => {
  const {
    isOpen: isOpenChangeRole,
    onOpen: onOpenChangeRole,
    onClose: onCloseChangeRole,
  } = useDisclosure()
  const {
    isOpen: isOpenUpdateUsername,
    onOpen: onOpenUpdateUsername,
    onClose: onCloseUpdateUsername,
  } = useDisclosure()

  return (
    <>
      <ModalEditRole
        isOpen={isOpenChangeRole}
        loading={loading}
        loadingRoles={loadingRoles}
        user={user}
        roles={roles}
        onClose={onCloseChangeRole}
        handleEditRole={handleEditRole}
      />
      <ModalUpdateUsername
        isOpen={isOpenUpdateUsername}
        user={user}
        updatingUsername={updatingUsername}
        onClose={onCloseUpdateUsername}
        handleUpdateUsername={handleUpdateUsername}
      />
      <Tr>
        <Td>{user.id}</Td>
        <Td>{formatName(user.name)}</Td>
        <Td>{user.role}</Td>
        {
          <Td w="1rem" p={0}>
            <ItemMenu
              onOpenChangeRole={onOpenChangeRole}
              permissions={permissions}
              onOpenRename={onOpenUpdateUsername}
            />
          </Td>
        }
      </Tr>
    </>
  )
}
