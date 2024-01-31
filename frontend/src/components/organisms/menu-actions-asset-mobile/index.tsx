import { Button, Menu, MenuButton, MenuList } from '@chakra-ui/react'
import React from 'react'

import { ItemActionAssetMobile } from 'components/atoms/item-action-asset-mobile'
import { PathRoute } from 'components/enums/path-route'
import {
  AddIcon,
  AuthorizeIcon,
  BackIcon,
  BlockIcon,
  BurnIcon,
  ChevronDownIcon,
  FileIcon,
  HomeIcon,
  TransferIcon,
} from 'components/icons'

interface IMenuActions {
  id: string
  selected:
    | 'HOME'
    | 'MINT'
    | 'BURN'
    | 'AUTHORIZE'
    | 'DISTRIBUTE'
    | 'FREEZE'
    | 'CLAWBACK'
    | 'PUBLISH_INFORMATION'
}

export const MenuActionsAssetMobile: React.FC<IMenuActions> = ({
  id,
  selected,
}) => {
  const isSelected = (
    page:
      | 'HOME'
      | 'MINT'
      | 'BURN'
      | 'AUTHORIZE'
      | 'DISTRIBUTE'
      | 'FREEZE'
      | 'CLAWBACK'
      | 'PUBLISH_INFORMATION'
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
          isSelected={isSelected('HOME')}
          title={'Asset home'}
          icon={<HomeIcon />}
          path={`${PathRoute.ASSET_HOME}/${id}`}
        />

        <ItemActionAssetMobile
          isSelected={isSelected('MINT')}
          title={'Mint assets'}
          icon={<AddIcon />}
          path={`${PathRoute.MINT_ASSET}/${id}`}
        />

        <ItemActionAssetMobile
          isSelected={isSelected('BURN')}
          title={'Burn assets'}
          icon={<BurnIcon />}
          path={`${PathRoute.BURN_ASSET}/${id}`}
        />

        <ItemActionAssetMobile
          isSelected={isSelected('DISTRIBUTE')}
          title={'Distribute'}
          icon={<TransferIcon />}
          path={`${PathRoute.DISTRIBUTE_ASSET}/${id}`}
        />

        <ItemActionAssetMobile
          isSelected={isSelected('AUTHORIZE')}
          title={'Authorize account'}
          icon={<AuthorizeIcon />}
          path={`${PathRoute.AUTHORIZE_ACCOUNT}/${id}`}
        />

        <ItemActionAssetMobile
          isSelected={isSelected('FREEZE')}
          title={'Freeze account'}
          icon={<BlockIcon />}
          path={`${PathRoute.FREEZE_ACCOUNT}/${id}`}
        />

        <ItemActionAssetMobile
          isSelected={isSelected('CLAWBACK')}
          title={'Clawback'}
          icon={<BackIcon />}
          path={`${PathRoute.CLAWBACK_ASSET}/${id}`}
        />

        <ItemActionAssetMobile
          isSelected={isSelected('PUBLISH_INFORMATION')}
          title={'Publish information'}
          icon={<FileIcon />}
          path={`${PathRoute.PUBLISH_INFORMATION}/${id}`}
        />
      </MenuList>
    </Menu>
  )
}
