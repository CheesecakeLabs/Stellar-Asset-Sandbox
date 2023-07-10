import { Button, Container, Text, Flex } from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { AssetActions } from 'components/enums/asset-actions'
import { PathRoute } from 'components/enums/path-route'
import {
  AddIcon,
  AuthorizeIcon,
  BackIcon,
  BlockIcon,
  BurnIcon,
  TransferIcon,
} from 'components/icons'

interface IMenuActionsAsset {
  action: AssetActions,
  asset: Hooks.UseAssetsTypes.IAssetDto
}

export const MenuActionsAsset: React.FC<IMenuActionsAsset> = ({ action, asset }) => {
  const navigate = useNavigate()

  return (
    <Flex maxW="290px" flexDir="column" w="full">
      <Flex h="3.5rem" alignItems="center">
        <Text fontSize="md" fontWeight="400">
          Actions
        </Text>
      </Flex>
      <Container variant="primary" p="1rem">
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
            navigate(PathRoute.MINT_ASSET, {state : asset})
          }}
        >
          Mint Assets
        </Button>
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
            navigate(PathRoute.BURN_ASSET, {state : asset})
          }}
        >
          Burn Assets
        </Button>
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
            navigate(PathRoute.DISTRIBUTE_ASSET, {state : asset})
          }}
        >
          Distribute
        </Button>
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
            navigate(PathRoute.AUTHORIZE_ACCOUNT, {state : asset})
          }}
        >
          Authorize account
        </Button>
        <Button
          variant={
            action === AssetActions.FREEZE ? 'menuButtonSelected' : 'menuButton'
          }
          leftIcon={
            <Flex w="1rem" justifyContent="center">
              <BlockIcon />
            </Flex>
          }
          onClick={(): void => {
            navigate(PathRoute.FREEZE_ACCOUNT, {state : asset})
          }}
        >
          Freeze account
        </Button>
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
            navigate(PathRoute.CLAWBACK_ASSET, {state : asset})
          }}
        >
          Clawback
        </Button>
      </Container>
    </Flex>
  )
}
