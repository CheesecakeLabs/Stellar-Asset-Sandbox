import {
  Button,
  Checkbox,
  Container,
  Flex,
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useMediaQuery,
} from '@chakra-ui/react'
import React, { Dispatch, SetStateAction } from 'react'

import { MAX_PAGE_WIDTH } from 'utils/constants/sizes'

import { MenuAdminMobile } from 'components/organisms/menu-admin-mobile'

import Authentication from 'app/auth/services/auth'
import { IChange } from 'app/core/pages/role-permissions'

interface IRolePermissionsTemplate {
  loading: boolean
  roles: Hooks.UseAuthTypes.IRole[] | undefined
  userPermissions: Hooks.UseAuthTypes.IUserPermission[] | undefined
  permissions: Hooks.UseAuthTypes.IPermission[] | undefined
  rolesPermissions: Hooks.UseAuthTypes.IRolePermission[] | undefined
  updatingRolesPermissions: boolean
  changes: IChange[]
  setChanges: Dispatch<SetStateAction<IChange[]>>
  onSubmit(params: Hooks.UseAuthTypes.IRolePermission[]): Promise<void>
}

export const RolePermissionsTemplate: React.FC<IRolePermissionsTemplate> = ({
  loading,
  roles,
  permissions,
  rolesPermissions,
  updatingRolesPermissions,
  changes,
  onSubmit,
  setChanges,
}) => {
  const [isSmallerThanMd] = useMediaQuery('(max-width: 768px)')

  const havePermissionByRole = (
    permissionId: number,
    roleId: number
  ): boolean => {
    return (
      rolesPermissions?.find(
        rolePermission =>
          rolePermission.permission_id == permissionId &&
          rolePermission.role_id == roleId
      ) !== undefined
    )
  }

  const onChange = (
    permissionId: number,
    roleId: number,
    isAdd: boolean
  ): void => {
    const filtered = changes?.filter(
      change =>
        !(change.permission_id == permissionId && change.role_id == roleId)
    )
    const newChange = {
      role_id: roleId,
      permission_id: permissionId,
      is_add: isAdd,
    }
    setChanges([...filtered, newChange])
  }

  const isDisabled = (role: Hooks.UseAuthTypes.IRole): boolean => {
    return role.admin === 1 || role.created_by != Authentication.getUser()?.id
  }

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
          {isSmallerThanMd && <MenuAdminMobile selected={'ROLE_PERMISSIONS'} />}
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
              <Text>Permissions</Text>
            </Flex>
            <Button
              variant="primary"
              isLoading={updatingRolesPermissions}
              isDisabled={changes.length === 0}
              onClick={(): void => {
                onSubmit(changes)
              }}
            >
              Save changes
            </Button>
          </Flex>
          {loading ? (
            <Skeleton h="8rem" />
          ) : (
            <Flex>
              <TableContainer minW="max-content">
                <Table w="full" variant="list">
                  <Thead w="full">
                    <Tr position="sticky">
                      <Th>Role name</Th>
                    </Tr>
                    ◊
                  </Thead>
                  <Tbody>
                    {permissions?.map((permission, index) => (
                      <Tr key={index}>
                        <Td position="sticky">
                          <Text fontSize={{ base: 'xs', md: 'sm' }}>
                            {permission.name}
                          </Text>
                          <Text fontSize="xs" maxW="400px">
                            {permission.description}
                          </Text>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
              <TableContainer w="full">
                <Table
                  w="full"
                  variant="list"
                  overflowX="unset"
                  overflowY="unset"
                >
                  <Thead w="full">
                    <Tr position="sticky">
                      {roles?.map((role, index) => (
                        <Th textAlign="center" key={index}>
                          {role.name}
                        </Th>
                      ))}
                    </Tr>
                  </Thead>
                  <Tbody>
                    {permissions?.map((permission, index) => (
                      <Tr key={index}>
                        {roles?.map((role, index) => (
                          <Td key={index}>
                            <Checkbox
                              w="full"
                              justifyContent="center"
                              defaultChecked={havePermissionByRole(
                                permission.id,
                                role.id
                              )}
                              isDisabled={isDisabled(role)}
                              title={
                                isDisabled(role)
                                  ? 'You can only edit roles you created'
                                  : ''
                              }
                              onChange={(event): void => {
                                onChange(
                                  permission.id,
                                  role.id,
                                  event.target.checked
                                )
                              }}
                            />
                          </Td>
                        ))}
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Flex>
          )}
        </Container>
      </Flex>
    </Flex>
  )
}
