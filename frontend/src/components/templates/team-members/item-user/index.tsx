import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Td,
  Tr,
  useDisclosure,
} from '@chakra-ui/react'
import React, { ReactNode } from 'react'

import { havePermission } from 'utils'
import { formatName } from 'utils/formatter'

import { Permissions } from 'components/enums/permissions'
import { MenuDotsIcon } from 'components/icons'
import { ModalEditRole } from 'components/molecules'

import { ItemMenu } from '../item-menu'

interface IItemUser {
  user: Hooks.UseAuthTypes.IUserDto
  loading: boolean
  handleEditRole(params: Hooks.UseAuthTypes.IUserRole): Promise<boolean>
  roles: Hooks.UseAuthTypes.IRole[] | undefined
  loadingRoles: boolean
  permissions: Hooks.UseAuthTypes.IUserPermission[] | undefined
}

export const ItemUser: React.FC<IItemUser> = ({
  user,
  loading,
  handleEditRole,
  roles,
  loadingRoles,
  permissions,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <ModalEditRole
        isOpen={isOpen}
        onClose={onClose}
        loading={loading}
        loadingRoles={loadingRoles}
        user={user}
        handleEditRole={handleEditRole}
        roles={roles}
      />
      <Tr>
        <Td>{user.id}</Td>
        <Td>{formatName(user.name)}</Td>
        <Td>{user.role}</Td>
        {
          <Td w="1rem" p={0}>
            <ItemMenu onOpen={onOpen} permissions={permissions} />
          </Td>
        }
      </Tr>
    </>
  )
}
