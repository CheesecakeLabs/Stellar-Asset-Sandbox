import {
  Button,
  Container,
  Flex,
  Skeleton,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  useDisclosure,
} from '@chakra-ui/react'
import React from 'react'

import { MAX_PAGE_WIDTH } from 'utils/constants/sizes'

import { ItemRole } from './item-role'
import { ModalRoleManage } from './modal-role-manage'

interface IRolesManageTemplate {
  roles: Hooks.UseAuthTypes.IRole[] | undefined
  loadingRoles: boolean
  creatingRole: boolean
  updatingRole: boolean
  deletingRole: boolean
  handleRole(name: string, id?: number): Promise<boolean>
  handleDeleteRole(id: number, idNewUsersRole: number): Promise<boolean>
}

export const RolesManageTemplate: React.FC<IRolesManageTemplate> = ({
  roles,
  creatingRole,
  updatingRole,
  deletingRole,
  loadingRoles,
  handleRole,
  handleDeleteRole,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <ModalRoleManage
        isOpen={isOpen}
        loading={updatingRole || creatingRole}
        isUpdate={false}
        onClose={onClose}
        handleRole={handleRole}
      />
      <Flex flexDir="column" w="full">
        <Flex
          maxW={MAX_PAGE_WIDTH}
          alignSelf="center"
          flexDir="column"
          w="full"
        >
          <Text fontSize="2xl" fontWeight="400" mb="1.5rem">
            Settings
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
                <Text>Roles</Text>
              </Flex>
              <Button variant="primary" onClick={onOpen}>
                Create role
              </Button>
            </Flex>
            {loadingRoles ? (
              <Skeleton h="8rem" />
            ) : (
              <Table w="full" variant="list">
                <Thead w="full">
                  <Th>Role name</Th>
                  <Th justifyContent="flex-end" display="flex">
                    Actions
                  </Th>
                </Thead>
                <Tbody>
                  {roles?.map(role => (
                    <ItemRole
                      role={role}
                      loading={creatingRole || updatingRole || deletingRole}
                      roles={roles}
                      loadingRoles={loadingRoles}
                      handleRole={handleRole}
                      handleDeleteRole={handleDeleteRole}
                    />
                  ))}
                </Tbody>
              </Table>
            )}
          </Container>
        </Flex>
      </Flex>
    </>
  )
}