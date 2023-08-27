import { Button, Container, Text, Flex } from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { PathRoute } from 'components/enums/path-route'
import { SettingsOptions } from 'components/enums/settings-options'
import { MembersIcon, PermissionsIcon } from 'components/icons'

interface IMenuSettings {
  option: SettingsOptions
}

export const MenuSettings: React.FC<IMenuSettings> = ({ option }) => {
  const navigate = useNavigate()

  return (
    <Flex w="290px" flexDir="column">
      <Flex h="3.5rem" alignItems="center">
        <Text fontSize="md" fontWeight="400">
          Menu
        </Text>
      </Flex>
      <Container variant="primary" p="0">
        <Button
          variant={
            option === SettingsOptions.TEAM_MEMBERS
              ? 'menuButtonSelected'
              : 'menuButton'
          }
          borderTopRadius="0.25rem"
          leftIcon={
            <Flex w="1rem" justifyContent="center">
              <MembersIcon />
            </Flex>
          }
          onClick={(): void => {
            navigate(`${PathRoute.TEAM_MEMBERS}`)
          }}
        >
          Team members
        </Button>
        <Button
          variant={
            option === SettingsOptions.PERMISSIONS
              ? 'menuButtonSelected'
              : 'menuButton'
          }
          borderBottomRadius="0.25rem"
          leftIcon={
            <Flex w="1rem" justifyContent="center">
              <PermissionsIcon />
            </Flex>
          }
          onClick={(): void => {
            navigate(`${PathRoute.PERMISSIONS}`)
          }}
        >
          Permissions
        </Button>
      </Container>
    </Flex>
  )
}
