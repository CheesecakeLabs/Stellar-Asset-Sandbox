import {
  Checkbox,
  Container,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import React from 'react'

import { MAX_PAGE_WIDTH } from 'utils/constants/sizes'

import { InfoIcon } from 'components/icons'

interface IPermissionsTemplate {
  loading: boolean
  roles: Hooks.UseAuthTypes.IRole[] | undefined
  loadingRoles: boolean
  permissions: Hooks.UseAuthTypes.IPermission[] | undefined
}

export const PermissionsTemplate: React.FC<IPermissionsTemplate> = ({
  loading,
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
              <Text>Permissions</Text>
            </Flex>
          </Flex>
          <Table w="full" variant="list">
            <Thead w="full">
              <Th>Role name</Th>
              <Th>Description</Th>
              <Th textAlign="center">Enable</Th>
            </Thead>
            <Tbody>
              <Tr>
                <Td>Forge asset</Td>
                <Td fontSize="sm">Lorem ipsum</Td>
                <Td>
                  <Checkbox w="full" justifyContent="center" />
                </Td>
              </Tr>
              <Tr>
                <Td>Forge asset</Td>
                <Td fontSize="sm">Lorem ipsum</Td>
                <Td>
                  <Checkbox w="full" justifyContent="center" />
                </Td>
              </Tr>
              <Tr>
                <Td>Forge asset</Td>
                <Td fontSize="sm">Lorem ipsum</Td>
                <Td>
                  <Checkbox w="full" justifyContent="center" />
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </Container>
      </Flex>
    </Flex>
  )
}
