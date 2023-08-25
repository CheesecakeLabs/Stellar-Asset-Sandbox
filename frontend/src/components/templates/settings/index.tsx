import {
  Container,
  Flex,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import React from 'react'

import { MAX_PAGE_WIDTH } from 'utils/constants/sizes'

import { Loading } from 'components/atoms'
import { InfoIcon } from 'components/icons'
import { Empty } from 'components/molecules/empty'

import { ItemUser } from './item-user'

interface ISettingsTemplate {
  users: Hooks.UseAuthTypes.IUserDto[] | undefined
  loading: boolean
  handleEditRole(params: Hooks.UseAuthTypes.IUserRole): Promise<boolean>
  roles: Hooks.UseAuthTypes.IRole[] | undefined
  loadingRoles: boolean
  permissions: Hooks.UseAuthTypes.IPermission[] | undefined
}

export const SettingsTemplate: React.FC<ISettingsTemplate> = ({
  users,
  loading,
  handleEditRole,
  roles,
  loadingRoles,
  permissions,
}) => {
  return (
    <Flex flexDir="column" w="full">
      <Flex maxW={MAX_PAGE_WIDTH} alignSelf="center" flexDir="column" w="full">
        <Text fontSize="2xl" fontWeight="400" mb="1.5rem">
          Settings
        </Text>
        <Container variant="primary" px={0} pb={2} maxW="full">
          <Flex
            justifyContent="space-between"
            px="1.25rem"
            pb="1rem"
            borderBottom="1px solid"
            borderColor={'gray.400'}
            _dark={{ borderColor: 'black.800' }}
            alignItems="center"
          >
            <Flex
              gap={1}
              alignItems="center"
              fill="gray"
              _dark={{ fill: 'white' }}
            >
              <Text>Team members</Text>
              <InfoIcon />
            </Flex>
          </Flex>
          {loading ? (
            <Loading />
          ) : !users || users.length === 0 ? (
            <Empty title="No team members" />
          ) : (
            <Table w="full">
              <Thead w="full">
                <Tr>
                  <Th
                    borderColor={'gray.400'}
                    _dark={{ borderColor: 'black.800' }}
                  />
                  <Th
                    color={'gray.700'}
                    borderColor={'gray.400'}
                    _dark={{ borderColor: 'black.800' }}
                  >
                    Member
                  </Th>
                  <Th
                    color={'gray.700'}
                    borderColor={'gray.400'}
                    _dark={{ borderColor: 'black.800' }}
                  >
                    Role
                  </Th>
                  <Th
                    color={'gray.700'}
                    borderColor={'gray.400'}
                    _dark={{ borderColor: 'black.800' }}
                  >
                    Last active
                  </Th>
                  <Th
                    color={'gray.700'}
                    borderColor={'gray.400'}
                    _dark={{ borderColor: 'black.800' }}
                    w="1rem"
                    p={0}
                  ></Th>
                </Tr>
              </Thead>
              <Tbody>
                {users.map(user => (
                  <ItemUser
                    user={user}
                    loading={loading}
                    handleEditRole={handleEditRole}
                    roles={roles}
                    loadingRoles={loadingRoles}
                    permissions={permissions}
                  />
                ))}
              </Tbody>
            </Table>
          )}
        </Container>
      </Flex>
    </Flex>
  )
}
