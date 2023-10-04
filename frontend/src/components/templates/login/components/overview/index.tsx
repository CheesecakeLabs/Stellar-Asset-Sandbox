import {
  Text,
  Flex,
  Container,
  Skeleton,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import React from 'react'

import { CircleCheckIcon } from 'components/icons'

import { ReactComponent as StellarLogo } from 'app/core/resources/stellar.svg'

interface IOverview {
  roles: Hooks.UseAuthTypes.IRole[] | undefined
  permissions: Hooks.UseAuthTypes.IPermission[] | undefined
  rolesPermissions: Hooks.UseAuthTypes.IRolePermission[] | undefined
  loading: boolean
}

export const Overview: React.FC<IOverview> = ({
  roles,
  permissions,
  rolesPermissions,
  loading,
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

  return (
    <Flex w="full" py="2rem">
      <Flex
        maxW="1280px"
        w="full"
        margin="auto"
        flexDir="column"
        h="full"
        px="3rem"
      >
        <Flex fill="black" _dark={{ fill: 'white' }} mb="4rem">
          <StellarLogo width="128px" />
        </Flex>
        <Flex>
          <Flex flexDir="column" maxW="280px" mr="1.5rem">
            <Text fontSize="xl" mb="0.75rem" mt="1rem">
              Manage roles
            </Text>
            <Text>
              In the Sandbox you can define permissions for each type of role
              you want, and you can also create new roles
            </Text>
          </Flex>
          {roles && (
            <Container
              variant="primary"
              px={0}
              pb={0}
              maxW="full"
              overflowX="auto"
              borderRadius="1rem"
            >
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
                          <Text fontSize="sm">{permission.name}</Text>
                          <Text fontSize="xs" maxW="400px">
                            {permission.description}
                          </Text>
                        </Td>
                        {roles?.map(role => (
                          <Td fill="primary.normal">
                            <Flex w="full" justifyContent="center">
                              {havePermissionByRole(permission.id, role.id) && (
                                <CircleCheckIcon />
                              )}
                            </Flex>
                          </Td>
                        ))}
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </Container>
          )}
        </Flex>
      </Flex>
    </Flex>
  )
}
