import { Button, Flex, Text } from '@chakra-ui/react'
import React from 'react'

import Authentication from 'app/auth/services/auth'

interface IProfileTemplate {
  handleSignOut(): Promise<void>
  loading: boolean
}

export const ProfileTemplate: React.FC<IProfileTemplate> = ({
  handleSignOut,
  loading,
}) => {
  return (
    <Flex flexDir="column" w="full">
      <Flex w="584px" alignSelf="center" flexDir="column">
        <Text fontSize="2xl" color="black" fontWeight="400" mb="1.5rem">
          Profile
        </Text>
        <Flex
          flexDir="column"
          bg="white"
          border="1px solid"
          borderColor="gray.600"
          borderRadius="0.5rem"
          p="1.5rem"
        >
          <Flex
            borderBottom="1px solid"
            borderColor="gray.400"
            py="1rem"
            alignItems="center"
          >
            <Text fontSize="sm" w="50%" color="black">
              Name
            </Text>
            <Text fontSize="sm" color="black" fontWeight="400">
              {Authentication.getUser()?.name}
            </Text>
          </Flex>
          <Flex
            borderBottom="1px solid"
            borderColor="gray.400"
            py="1rem"
            alignItems="center"
          >
            <Text fontSize="sm" w="50%" color="black">
              Email
            </Text>
            <Text fontSize="sm" color="black" fontWeight="400">
              {Authentication.getUser()?.email}
            </Text>
          </Flex>
          <Flex
            borderBottom="1px solid"
            borderColor="gray.400"
            py="1rem"
            alignItems="center"
          >
            <Text fontSize="sm" w="50%" color="black">
              Sign out of account
            </Text>
            <Button
              variant="primary"
              w="max-content"
              onClick={handleSignOut}
              isLoading={loading}
            >
              Log out
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}
