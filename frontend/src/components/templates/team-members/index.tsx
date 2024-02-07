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
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react'
import React from 'react'

import { MAX_PAGE_WIDTH } from 'utils/constants/sizes'

import { Empty } from 'components/molecules/empty'
import { MenuAdminMobile } from 'components/organisms/menu-admin-mobile'

import { ItemMenu } from './item-menu'
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
  const [isSmallerThanMd] = useMediaQuery('(max-width: 768px)')
  const { onOpen } = useDisclosure()

  return (
    <Flex flexDir="column" w="full">
      <Flex maxW={MAX_PAGE_WIDTH} alignSelf="center" flexDir="column" w="full">
        <Flex
          justifyContent="space-between"
          w="full"
          alignItems="center"
          mb="1.5rem"
        >
          <Text fontSize="2xl" fontWeight="400">
            Administration
          </Text>
          {isSmallerThanMd && <MenuAdminMobile selected={'TEAM_MEMBERS'} />}
        </Flex>

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
          ) : isSmallerThanMd ? (
            <Flex flexDir="column">
              {users?.map((user, index) => (
                <Flex
                  key={index}
                  borderBottom="1px solid"
                  borderColor={'gray.600'}
                  _dark={{ borderColor: 'black.800' }}
                  justifyContent="space-between"
                  pb={2}
                  pt={2}
                  mx={4}
                >
                  <Flex flexDir="column" gap={1}>
                    <Flex alignItems="center" gap={2}>
                      <Text>{user.name}</Text>
                    </Flex>
                    <Flex gap="0.35rem" alignItems="center">
                      <Text fontWeight="bold">ID:</Text>
                      <Text>{user.id}</Text>
                    </Flex>
                    <Flex gap="0.35rem">
                      <Text fontWeight="bold">Role:</Text>
                      <Text>{`${user.role}`}</Text>
                    </Flex>
                  </Flex>
                  <ItemMenu onOpen={onOpen} permissions={permissions} />
                </Flex>
              ))}
            </Flex>
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
