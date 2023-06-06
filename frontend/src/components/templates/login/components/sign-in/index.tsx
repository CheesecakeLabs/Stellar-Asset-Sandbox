import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from '@chakra-ui/react'
import React, { Dispatch, SetStateAction } from 'react'
import { Key, User } from 'react-feather'
import { useNavigate } from 'react-router-dom'

import { PathRoute } from 'components/enums/path-route'

interface ISignIn {
  setIsSignIn: Dispatch<SetStateAction<boolean>>
}

export const SignIn: React.FC<ISignIn> = ({ setIsSignIn }) => {
  const navigate = useNavigate()

  return (
    <Flex
      w="40%"
      pt="2rem"
      alignItems="center"
      flexDir="column"
      shadow="-8px 0 15px #222222"
    >
      <Flex
        flexDir="column"
        w="80%"
        mt="6rem"
        px="3rem"
        justifyContent="center"
      >
        <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb="3rem">
          Sign in to Sandbox
        </Text>

        <InputGroup mb="1.5rem">
          <InputLeftElement pointerEvents="none">
            <User size="1.25rem" />
          </InputLeftElement>
          <Input
            type="email"
            placeholder="Name"
            bg="gray.100"
            borderRadius="0.5rem"
            fontSize="md"
          />
        </InputGroup>

        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Key size="1.25rem" />
          </InputLeftElement>
          <Input
            placeholder="Password"
            bg="gray.100"
            borderRadius="0.5rem"
            fontSize="md"
            type="password"
          />
        </InputGroup>

        <Flex justifyContent="flex-end">
          <Button
            variant="link"
            fontSize="sm"
            color="primary.light"
            mt="0.5rem"
          >
            Forgot Password?
          </Button>
        </Flex>

        <Button
          variant="primary"
          mt="3rem"
          onClick={(): void => {
            navigate(PathRoute.HOME)
          }}
        >
          Sign in
        </Button>

        <Flex gap={1} justifyContent="center" mt="2rem">
          <Text>Don't have an account?</Text>
          <Button
            variant="link"
            color="primary.normal"
            onClick={(): void => {
              setIsSignIn(false)
            }}
          >
            Sign up!
          </Button>
        </Flex>
      </Flex>
    </Flex>
  )
}
