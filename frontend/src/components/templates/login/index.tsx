import { Button, Flex, FormLabel, Input, Text } from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { PathRoute } from 'components/enums/path-route'

import { ReactComponent as StellarLogo } from 'app/core/resources/stellar.svg'

export const LoginTemplate: React.FC = () => {
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
      <StellarLogo fill="black" />
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
        <Text fontSize="2xl" fontWeight="400" mb="1.5rem" color="black">
          Sign in to Asset Sandbox
        </Text>

        <FormLabel>Email address</FormLabel>
        <Input type="email" placeholder="Email address" />

        <FormLabel mt="1.5rem">Password</FormLabel>
        <Input placeholder="Password" type="password" />

        <Button
          variant="primary"
          mt="1.5rem"
          onClick={(): void => {
            navigate(PathRoute.HOME)
          }}
        >
          Sign in
        </Button>

        <Button
          variant="link"
          fontSize="sm"
          color="primary.normal"
          mt="1rem"
          fontWeight="500"
          onClick={(): void => {
            navigate(PathRoute.RESET_PASSWORD)
          }}
        >
          Forgot Password?
        </Button>

        <Flex gap={1} justifyContent="center" mt="3rem">
          <Text color="black" fontSize="sm">
            Don't have an account?
          </Text>
          <Button
            variant="link"
            fontSize="sm"
            color="primary.normal"
            fontWeight="500"
            onClick={(): void => {
              navigate(PathRoute.SIGNUP)
            }}
          >
            Sign up!
          </Button>
        </Flex>
      </Flex>
    </Flex>
  )
}
