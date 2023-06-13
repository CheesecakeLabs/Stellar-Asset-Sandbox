import { Button, Container, Flex, Text, useColorMode } from '@chakra-ui/react'
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
  const { colorMode } = useColorMode()

  return (
    <Flex flexDir="column" w="full">
      <Flex maxW="584px" alignSelf="center" flexDir="column" w="full">
        <Text fontSize="2xl" fontWeight="400" mb="1.5rem">
          Profile
        </Text>
        <Container variant="primary">
          <Flex
            borderBottom="1px solid"
            borderColor={colorMode == 'light' ? 'gray.400' : 'black.800'}
            py="1rem"
            alignItems="center"
          >
            <Text fontSize="sm" w="50%">
              Name
            </Text>
            <Text fontSize="sm" fontWeight="400">
              {Authentication.getUser()?.name}
            </Text>
          </Flex>
          <Flex
            borderBottom="1px solid"
            borderColor={colorMode == 'light' ? 'gray.400' : 'black.800'}
            py="1rem"
            alignItems="center"
          >
            <Text fontSize="sm" w="50%">
              Email
            </Text>
            <Text fontSize="sm" fontWeight="400">
              {Authentication.getUser()?.email}
            </Text>
          </Flex>
          <Flex
            borderBottom="1px solid"
            borderColor={colorMode == 'light' ? 'gray.400' : 'black.800'}
            py="1rem"
            alignItems="center"
          >
            <Text fontSize="sm" w="50%">
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
        </Container>
      </Flex>
    </Flex>
  )
}
