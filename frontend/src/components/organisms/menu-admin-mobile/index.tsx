import { Button, Menu, MenuButton, MenuList } from '@chakra-ui/react'
import React from 'react'

import { ItemActionAssetMobile } from 'components/atoms/item-action-asset-mobile'
import { PathRoute } from 'components/enums/path-route'
import {
  ChevronDownIcon,
  MembersIcon,
  PermissionsIcon,
  RoleIcon,
} from 'components/icons'

interface IMenuAdminMobile {
  selected: 'TEAM_MEMBERS' | 'ROLE_PERMISSIONS' | 'ROLES'
}

export const MenuAdminMobile: React.FC<IMenuAdminMobile> = ({ selected }) => {
  const isSelected = (
    page: 'TEAM_MEMBERS' | 'ROLE_PERMISSIONS' | 'ROLES'
  ): boolean => {
    return selected === page
  }

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon fill="white" />}
        bg="primary.normal"
        color="white"
        fontSize="sm"
        _hover={{
          backgroundColor: 'primary.normal',
        }}
        _active={{
          backgroundColor: 'primary.normal',
        }}
        borderRadius={0}
        h="2rem"
      >
        Actions
      </MenuButton>
      <MenuList stroke="gray" fill="gray">
        <ItemActionAssetMobile
          isSelected={isSelected('TEAM_MEMBERS')}
          title={'Team members'}
          icon={<MembersIcon width="16px" height="16px" />}
          path={`${PathRoute.SETTINGS}`}
        />

        <ItemActionAssetMobile
          isSelected={isSelected('ROLE_PERMISSIONS')}
          title={'Role permissions'}
          icon={<PermissionsIcon width="16px" height="16px" />}
          path={`${PathRoute.PERMISSIONS}`}
        />

        <ItemActionAssetMobile
          isSelected={isSelected('ROLES')}
          title={'Roles'}
          icon={<RoleIcon width="16px" height="16px" />}
          path={`${PathRoute.ROLES_MANAGE}`}
        />
      </MenuList>
    </Menu>
  )
}
