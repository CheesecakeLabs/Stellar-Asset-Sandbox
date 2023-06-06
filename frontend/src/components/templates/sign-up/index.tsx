import { Button, Flex, FormLabel, Input, Text } from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { PathRoute } from 'components/enums/path-route'

import { ReactComponent as StellarLogo } from 'app/core/resources/stellar.svg'

export const SignUpTemplate: React.FC = () => {
  const navigate = useNavigate()

  return (
    <Flex
      w="full"
      pt="1.5rem"
      px="2rem"
      flexDir="column"
      bg="gray.500"
      h="100vh"
    >
      <StellarLogo fill="black" width="300px" />
      <Flex
        flexDir="column"
        mt="6rem"
        justifyContent="center"
        bg="white"
        w="376px"
        p="2rem"
        border="1px solid gray.400"
        borderRadius="0.5rem"
        alignSelf="center"
      >
        <Text fontSize="2xl" fontWeight="400" mb="0.5rem" color="black">
          Create an account
        </Text>
        <Text fontSize="sm" fontWeight="400" mb="1.5rem" color="black">
          You were invited by tomer@stellar.org
        </Text>

        <FormLabel>Email address</FormLabel>
        <Input type="email" placeholder="Email address" />

        <FormLabel mt="1.5rem">Password</FormLabel>
        <Input placeholder="Password" type="password" />

        <FormLabel mt="1.5rem">Confirm password</FormLabel>
        <Input placeholder="Confirm password" type="password" />

        <Button
          variant="primary"
          mt="1.5rem"
          onClick={(): void => {
            navigate(PathRoute.HOME)
          }}
        >
          Create account
        </Button>
      </Flex>
    </Flex>
  )
}
