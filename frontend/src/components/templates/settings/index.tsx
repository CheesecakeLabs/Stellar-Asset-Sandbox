import {
  Container,
  Flex,
  Table,
  Td,
  Text,
  Thead,
  Tr,
  useColorMode,
} from '@chakra-ui/react'
import React from 'react'

import { isDark } from 'utils'
import { mockupTeamMembers } from 'utils/mockups'

import { AddUserIcon, InfoIcon, MenuDotsIcon } from 'components/icons'

export const SettingsTemplate: React.FC = () => {
  const { colorMode } = useColorMode()

  return (
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
          <Table w="full">
            <Thead w="full">
              <Td color={'gray.700'}>Member</Td>
              <Td color={'gray.700'}>Role</Td>
              <Td color={'gray.700'}>Last active</Td>
              <Td color={'gray.700'} w="1rem"></Td>
            </Thead>
            {mockupTeamMembers.map(member => (
              <Tr>
                <Td>{member.name}</Td>
                <Td>{member.role}</Td>
                <Td>{member.lastActive}</Td>
                <Td>
                  <MenuDotsIcon fill={isDark(colorMode) ? 'white' : 'black'} />
                </Td>
              </Tr>
            ))}
          </Table>
        </Container>
      </Flex>
    </Flex>
  )
}
