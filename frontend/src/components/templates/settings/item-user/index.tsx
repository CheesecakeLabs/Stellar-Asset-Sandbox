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
import TimeAgo from 'react-timeago'

import { havePermission } from 'utils'

import { Permissions } from 'components/enums/permissions'
import { MenuDotsIcon } from 'components/icons'
import { ModalEditRole } from 'components/molecules'

interface IItemUser {
  user: Hooks.UseAuthTypes.IUserDto
  isDark: boolean
  loading: boolean
  handleEditRole(params: Hooks.UseAuthTypes.IUserRole): Promise<boolean>
  roles: Hooks.UseAuthTypes.IRole[] | undefined
  loadingRoles: boolean
  permissions: Hooks.UseAuthTypes.IPermission[] | undefined
}

export const ItemMember: React.FC<IItemUser> = ({
  user,
  isDark,
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
        <Td>{user.name}</Td>
        <Td>{user.role}</Td>
        <Td>{<TimeAgo date={Date.parse(user.updated_at)} />}</Td>
        <Td w="1rem" p={0}>
          {havePermission(Permissions.EDIT_USERS_ROLE, permissions) && (
            <Menu>
              {({ isOpen }): ReactNode => (
                <>
                  <MenuButton
                    isActive={isOpen}
                    as={IconButton}
                    bg="none"
                    h="2rem"
                    w="0.5rem"
                    p="0"
                    icon={<MenuDotsIcon fill={isDark ? 'white' : 'black'} />}
                  />
                  <MenuList>
                    <MenuItem onClick={onOpen}>Edit role</MenuItem>
                  </MenuList>
                </>
              )}
            </Menu>
          )}
        </Td>
      </Tr>
    </>
  )
}
