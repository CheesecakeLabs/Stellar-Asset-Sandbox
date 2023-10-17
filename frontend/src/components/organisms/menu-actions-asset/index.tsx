import { Button, Container, Text, Flex } from '@chakra-ui/react'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { havePermission } from 'utils'

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
  const navigate = useNavigate()
  const { id } = useParams()

  return (
    <Flex w="290px" flexDir="column">
      <Flex h="3.5rem" alignItems="center">
        <Text fontSize="md" fontWeight="400">
          Actions
        </Text>
      </Flex>
      <Container variant="primary" p="0">
        <Button
          variant={
            action === AssetActions.HOME ? 'menuButtonSelected' : 'menuButton'
          }
          borderTopRadius="0.25rem"
          leftIcon={
            <Flex w="1rem" justifyContent="center">
              <HomeIcon />
            </Flex>
          }
          isDisabled={!id}
          onClick={(): void => {
            navigate(`${PathRoute.ASSET_HOME}/${id}`)
          }}
        >
          Asset home
        </Button>
        {havePermission(Permissions.MINT_ASSET, permissions) && (
          <Button
            variant={
              action === AssetActions.MINT ? 'menuButtonSelected' : 'menuButton'
            }
            leftIcon={
              <Flex w="1rem" justifyContent="center">
                <AddIcon />
              </Flex>
            }
            onClick={(): void => {
              navigate(`${PathRoute.MINT_ASSET}/${id}`)
            }}
          >
            Mint assets
          </Button>
        )}
        {havePermission(Permissions.BURN_ASSET, permissions) && (
          <Button
            variant={
              action === AssetActions.BURN ? 'menuButtonSelected' : 'menuButton'
            }
            leftIcon={
              <Flex w="1rem" justifyContent="center">
                <BurnIcon />
              </Flex>
            }
            onClick={(): void => {
              navigate(`${PathRoute.BURN_ASSET}/${id}`)
            }}
          >
            Burn assets
          </Button>
        )}
        {havePermission(Permissions.DISTRIBUTE_ASSET, permissions) && (
          <Button
            variant={
              action === AssetActions.DISTRIBUTE
                ? 'menuButtonSelected'
                : 'menuButton'
            }
            leftIcon={
              <Flex w="1rem" justifyContent="center">
                <TransferIcon />
              </Flex>
            }
            onClick={(): void => {
              navigate(`${PathRoute.DISTRIBUTE_ASSET}/${id}`)
            }}
          >
            Distribute
          </Button>
        )}
        {havePermission(Permissions.AUTHORIZE_ASSET, permissions) && (
          <Button
            variant={
              action === AssetActions.AUTHORIZE
                ? 'menuButtonSelected'
                : 'menuButton'
            }
            leftIcon={
              <Flex w="1rem" justifyContent="center">
                <AuthorizeIcon />
              </Flex>
            }
            onClick={(): void => {
              navigate(`${PathRoute.AUTHORIZE_ACCOUNT}/${id}`)
            }}
          >
            Authorize account
          </Button>
        )}
        {havePermission(Permissions.FREEZE_ACCOUNT, permissions) && (
          <Button
            variant={
              action === AssetActions.FREEZE
                ? 'menuButtonSelected'
                : 'menuButton'
            }
            leftIcon={
              <Flex w="1rem" justifyContent="center">
                <BlockIcon />
              </Flex>
            }
            onClick={(): void => {
              navigate(`${PathRoute.FREEZE_ACCOUNT}/${id}`)
            }}
          >
            Freeze account
          </Button>
        )}
        {havePermission(Permissions.CLAWBACK_ASSET, permissions) && (
          <Button
            variant={
              action === AssetActions.CLAWBACK
                ? 'menuButtonSelected'
                : 'menuButton'
            }
            leftIcon={
              <Flex w="1rem" justifyContent="center">
                <BackIcon />
              </Flex>
            }
            onClick={(): void => {
              navigate(`${PathRoute.CLAWBACK_ASSET}/${id}`)
            }}
          >
            Clawback
          </Button>
        )}
        {havePermission(Permissions.CLAWBACK_ASSET, permissions) && (
          <Button
            variant={
              action === AssetActions.PUBLISH_INFORMATION
                ? 'menuButtonSelected'
                : 'menuButton'
            }
            borderBottomRadius="0.25rem"
            leftIcon={
              <Flex w="1rem" justifyContent="center">
                <FileIcon />
              </Flex>
            }
            onClick={(): void => {
              navigate(`${PathRoute.PUBLISH_INFORMATION}/${id}`)
            }}
          >
            Publish information
          </Button>
        )}
      </Container>
    </Flex>
  )
}
