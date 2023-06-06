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

interface ISignUp {
  setIsSignIn: Dispatch<SetStateAction<boolean>>
}

export const SignUp: React.FC<ISignUp> = ({ setIsSignIn }) => {
  return (
    <Flex
      w="40%"
      pt="2rem"
      alignItems="center"
      flexDir="column"
      shadow="-5px 0 15px #111111"
    >
      <Flex
        flexDir="column"
        w="80%"
        mt="6rem"
        px="3rem"
        justifyContent="center"
      >
        <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb="3rem">
          Sign up to Sandbox
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

        <InputGroup mb="1.5rem">
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

        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Key size="1.25rem" />
          </InputLeftElement>
          <Input
            placeholder="Confirm password"
            bg="gray.100"
            borderRadius="0.5rem"
            fontSize="md"
            type="password"
          />
        </InputGroup>

        <Button variant="primary" mt="3rem">
          Sign up
        </Button>

        <Flex gap={1} justifyContent="center" mt="2rem">
          <Text>Already have an account?</Text>
          <Button
            variant="link"
            color="primary.normal"
            onClick={(): void => {
              setIsSignIn(true)
            }}
          >
            Sign in!
          </Button>
        </Flex>
      </Flex>
    </Flex>
  )
}
