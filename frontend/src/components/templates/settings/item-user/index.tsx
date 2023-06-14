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

import { MenuDotsIcon } from 'components/icons'

import { ModalEditRole } from '../modal-edit-role'

interface IItemUser {
  user: Hooks.UseAuthTypes.IUserDto
  isDark: boolean
  loading: boolean
  handleEditRole(params: Hooks.UseAuthTypes.IUserRole): Promise<boolean>
  roles: Hooks.UseAuthTypes.IRole[] | undefined
  loadingRoles: boolean
}

export const ItemMember: React.FC<IItemUser> = ({
  user,
  isDark,
  loading,
  handleEditRole,
  roles,
  loadingRoles,
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
        </Td>
      </Tr>
    </>
  )
}
