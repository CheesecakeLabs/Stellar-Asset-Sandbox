import {
  Container,
  Flex,
  Table,
  Text,
  Th,
  Thead,
  Tr,
  useColorMode,
} from '@chakra-ui/react'
import React from 'react'

import { isDark } from 'utils'

import { Loading } from 'components/atoms'
import { AddUserIcon, InfoIcon } from 'components/icons'

import { ItemMember } from './item-user'

interface ISettingsTemplate {
  users: Hooks.UseAuthTypes.IUserDto[] | undefined
  loading: boolean
  handleEditRole(params: Hooks.UseAuthTypes.IUserRole): Promise<boolean>
  roles: Hooks.UseAuthTypes.IRole[] | undefined
  loadingRoles: boolean
}

export const SettingsTemplate: React.FC<ISettingsTemplate> = ({
  users,
  loading,
  handleEditRole,
  roles,
  loadingRoles,
}) => {
  const { colorMode } = useColorMode()

  return (
    <>
      <Flex flexDir="column" w="full">
        <Flex maxW="584px" alignSelf="center" flexDir="column" w="full">
          <Text fontSize="2xl" fontWeight="400" mb="1.5rem">
            Settings
          </Text>
          <Container variant="primary" px={0} pb={2}>
            <Flex
              justifyContent="space-between"
              px="1.25rem"
              pb="1rem"
              borderBottom="1px solid"
              borderColor={isDark(colorMode) ? 'gray.700' : 'gray.100'}
              alignItems="center"
            >
              <Flex gap={1} alignItems="center">
                <Text>Team members</Text>
                <InfoIcon fill={isDark(colorMode) ? 'white' : 'gray'} />
              </Flex>
              <AddUserIcon fill={isDark(colorMode) ? 'white' : 'black'} />
            </Flex>
            {loading || !users ? (
              <Loading />
            ) : (
              <Table w="full">
                <Thead w="full">
                  <Tr>
                    <Th color={'gray.700'}>Member</Th>
                    <Th color={'gray.700'}>Role</Th>
                    <Th color={'gray.700'}>Last active</Th>
                    <Th color={'gray.700'} w="1rem" p={0}></Th>
                  </Tr>
                </Thead>
                {users.map(user => (
                  <ItemMember
                    user={user}
                    isDark={isDark(colorMode)}
                    loading={loading}
                    handleEditRole={handleEditRole}
                    roles={roles}
                    loadingRoles={loadingRoles}
                  />
                ))}
              </Table>
            )}
          </Container>
        </Flex>
      </Flex>
    </>
  )
}
