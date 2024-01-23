import {
  Container,
  Flex,
  Skeleton,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import React from 'react'

import { MAX_PAGE_WIDTH } from 'utils/constants/sizes'

import { Empty } from 'components/molecules/empty'

import { ItemUser } from './item-user'

interface ISettingsTemplate {
  users: Hooks.UseAuthTypes.IUserDto[] | undefined
  loading: boolean
  handleEditRole(params: Hooks.UseAuthTypes.IUserRole): Promise<boolean>
  roles: Hooks.UseAuthTypes.IRole[] | undefined
  loadingRoles: boolean
  permissions: Hooks.UseAuthTypes.IUserPermission[] | undefined
}

export const TeamMembersTemplate: React.FC<ISettingsTemplate> = ({
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
          Administration
        </Text>
        <Container variant="primary" px={0} pb={0} maxW="full">
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
            </Flex>
          </Flex>
          {loading ? (
            <Skeleton h="8rem" w="full" />
          ) : !users || users.length === 0 ? (
            <Empty title="No team members" />
          ) : (
            <Table w="full" variant="list">
              <Thead w="full">
                <Tr>
                  <Th>ID</Th>
                  <Th>Member</Th>
                  <Th>Role</Th>
                </Tr>
              </Thead>
              <Tbody>
                {users.map((user, index) => (
                  <ItemUser
                    key={index}
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
