import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react'
import React, { ReactNode } from 'react'

import { havePermission } from 'utils'

import { Permissions } from 'components/enums/permissions'
import { MenuDotsIcon } from 'components/icons'

interface IItemMenu {
  onOpenChangeRole(): void
  onOpenRename(): void
  permissions: Hooks.UseAuthTypes.IUserPermission | undefined
}

export const ItemMenu: React.FC<IItemMenu> = ({
  onOpenChangeRole,
  onOpenRename,
  permissions,
}) => {
  return (
    <>
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
                fill="black"
                _dark={{ fill: 'white' }}
                icon={<MenuDotsIcon />}
              />
              <MenuList>
                <MenuItem onClick={onOpenChangeRole}>Change role</MenuItem>
                {permissions?.admin && (
                  <MenuItem onClick={onOpenRename}>Edit username</MenuItem>
                )}
              </MenuList>
            </>
          )}
        </Menu>
      )}
    </>
  )
}
