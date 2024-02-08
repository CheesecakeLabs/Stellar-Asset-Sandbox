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
  Tr,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react'
import React from 'react'

import { MAX_PAGE_WIDTH } from 'utils/constants/sizes'

import { MenuAdminMobile } from 'components/organisms/menu-admin-mobile'

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
  const [isSmallerThanMd] = useMediaQuery('(max-width: 768px)')

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
          <Flex
            justifyContent="space-between"
            w="full"
            alignItems="center"
            mb="1.5rem"
          >
            <Text fontSize="2xl" fontWeight="400">
              Administration
            </Text>
            {isSmallerThanMd && <MenuAdminMobile selected={'ROLES'} />}
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
                  <Tr>
                    <Th>Role name</Th>
                    <Th justifyContent="flex-end" display="flex">
                      Actions
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {roles?.map((role, index) => (
                    <ItemRole
                      key={index}
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
