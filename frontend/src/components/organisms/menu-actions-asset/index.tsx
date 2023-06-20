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
  action: AssetActions
}

export const MenuActionsAsset: React.FC<IMenuActionsAsset> = ({ action }) => {
  const navigate = useNavigate()

  return (
    <Flex maxW="290px" flexDir="column" w="full">
      <Text fontSize="2xl" fontWeight="400" mb="1rem">
        Actions
      </Text>
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
            navigate(PathRoute.MINT_ASSET)
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
            navigate(PathRoute.BURN_ASSET)
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
            navigate(PathRoute.DISTRIBUTE_ASSET)
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
            navigate(PathRoute.AUTHORIZE_ACCOUNT)
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
            navigate(PathRoute.FREEZE_ACCOUNT)
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
            navigate(PathRoute.CLAWBACK_ASSET)
          }}
        >
          Clawback
        </Button>
      </Container>
    </Flex>
  )
}
