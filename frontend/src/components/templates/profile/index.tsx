import { Button, Flex, Text } from '@chakra-ui/react'
import React from 'react'

interface IProfileTemplate {
  handleSignOut(): Promise<void>
  loading: boolean
}

export const ProfileTemplate: React.FC<IProfileTemplate> = ({
  handleSignOut,
  loading,
}) => {
  return (
    <Flex flexDir="column" gap={6}>
      <Text fontSize="xl" color="black">
        Profile
      </Text>
      <Button
        variant="primary"
        w="max-content"
        onClick={handleSignOut}
        isLoading={loading}
      >
        Logout
      </Button>
    </Flex>
  )
}
