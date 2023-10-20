import { Container, Text, Flex, useMediaQuery } from '@chakra-ui/react'
import React from 'react'
import { useParams } from 'react-router-dom'

import { havePermission } from 'utils'

import { ItemActionAsset } from 'components/atoms/item-action-asset'
import { AssetActions } from 'components/enums/asset-actions'
import { PathRoute } from 'components/enums/path-route'
import { Permissions } from 'components/enums/permissions'
import {
  AddIcon,
  AuthorizeIcon,
  BackIcon,
  BlockIcon,
  BurnIcon,
  FileIcon,
  HomeIcon,
  TransferIcon,
} from 'components/icons'

interface IMenuActionsAsset {
  action: AssetActions
  permissions: Hooks.UseAuthTypes.IUserPermission[] | undefined
}

export const MenuActionsAsset: React.FC<IMenuActionsAsset> = ({
  action,
  permissions,
}) => {
  const { id } = useParams()
  const [isLargerThanMd] = useMediaQuery('(min-width: 768px)')

  return (
    <Flex w={{ base: 'full', md: '290px' }} flexDir="column">
      {isLargerThanMd && (
        <Flex h="3.5rem" alignItems="center">
          <Text fontSize="md" fontWeight="400">
            Actions
          </Text>
        </Flex>
      )}
      <Container
        variant="primary"
        p="0"
        display="flex"
        flexDir={{ base: 'row', md: 'column' }}
        overflowX="auto"
      >
        <ItemActionAsset
          isCurrentAction={action === AssetActions.HOME}
          havePermission
          title={'Asset home'}
          path={`${PathRoute.ASSET_HOME}/${id}`}
          icon={<HomeIcon />}
        />

        <ItemActionAsset
          isCurrentAction={action === AssetActions.MINT}
          havePermission={havePermission(Permissions.MINT_ASSET, permissions)}
          title={'Mint assets'}
          path={`${PathRoute.MINT_ASSET}/${id}`}
          icon={<AddIcon />}
        />

        <ItemActionAsset
          isCurrentAction={action === AssetActions.BURN}
          havePermission={havePermission(Permissions.BURN_ASSET, permissions)}
          title={'Burn assets'}
          path={`${PathRoute.BURN_ASSET}/${id}`}
          icon={<BurnIcon />}
        />

        <ItemActionAsset
          isCurrentAction={action === AssetActions.DISTRIBUTE}
          havePermission={havePermission(
            Permissions.DISTRIBUTE_ASSET,
            permissions
          )}
          title={'Distribute'}
          path={`${PathRoute.DISTRIBUTE_ASSET}/${id}`}
          icon={<TransferIcon />}
        />

        <ItemActionAsset
          isCurrentAction={action === AssetActions.AUTHORIZE}
          havePermission={havePermission(
            Permissions.AUTHORIZE_ASSET,
            permissions
          )}
          title={'Authorize account'}
          path={`${PathRoute.AUTHORIZE_ACCOUNT}/${id}`}
          icon={<AuthorizeIcon />}
        />

        <ItemActionAsset
          isCurrentAction={action === AssetActions.FREEZE}
          havePermission={havePermission(
            Permissions.FREEZE_ACCOUNT,
            permissions
          )}
          title={'Freeze account'}
          path={`${PathRoute.FREEZE_ACCOUNT}/${id}`}
          icon={<BlockIcon />}
        />

        <ItemActionAsset
          isCurrentAction={action === AssetActions.CLAWBACK}
          havePermission={havePermission(
            Permissions.CLAWBACK_ASSET,
            permissions
          )}
          title={'Clawback'}
          path={`${PathRoute.CLAWBACK_ASSET}/${id}`}
          icon={<BackIcon />}
        />

        <ItemActionAsset
          isCurrentAction={action === AssetActions.PUBLISH_INFORMATION}
          havePermission={havePermission(
            Permissions.CLAWBACK_ASSET,
            permissions
          )}
          title={'Publish information'}
          path={`${PathRoute.PUBLISH_INFORMATION}/${id}`}
          icon={<FileIcon />}
        />
      </Container>
    </Flex>
  )
}
