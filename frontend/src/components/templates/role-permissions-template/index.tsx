import {
  Button,
  Checkbox,
  Container,
  Flex,
  Skeleton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import React, { Dispatch, SetStateAction } from 'react'

import { MAX_PAGE_WIDTH } from 'utils/constants/sizes'

import { IChange } from 'app/core/pages/role-permissions'

interface IRolePermissionsTemplate {
  loading: boolean
  roles: Hooks.UseAuthTypes.IRole[] | undefined
  loadingRoles: boolean
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
            <Table w="full" variant="list">
              <Thead w="full">
                <Th>Role name</Th>
                {roles?.map(role => (
                  <Th textAlign="center">{role.name}</Th>
                ))}
              </Thead>
              <Tbody>
                {permissions?.map(permission => (
                  <Tr>
                    <Td>
                      <Text>{permission.name}</Text>
                      <Text fontSize="xs" maxW="400px">
                        {permission.description}
                      </Text>
                    </Td>
                    {roles?.map(role => (
                      <Td>
                        <Checkbox
                          w="full"
                          justifyContent="center"
                          defaultChecked={havePermissionByRole(
                            permission.id,
                            role.id
                          )}
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
          )}
        </Container>
      </Flex>
    </Flex>
  )
}
