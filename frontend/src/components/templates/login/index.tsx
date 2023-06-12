import {
  Alert,
  AlertIcon,
  Button,
  Flex,
  FormLabel,
  Input,
  Text,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { PathRoute } from 'components/enums/path-route'

import { ReactComponent as StellarLogo } from 'app/core/resources/stellar.svg'

interface ILoginTemplate {
  handleLogin(params: Hooks.UseAuthTypes.ISignIn): Promise<void>
  loading: boolean
}

export const LoginTemplate: React.FC<ILoginTemplate> = ({
  handleLogin,
  loading,
}) => {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const { register, handleSubmit } = useForm()

  const onSubmit = async (data: FieldValues): Promise<void> => {
    setError(null)
    try {
      await handleLogin({
        email: data.email,
        password: data.password,
      })
    } catch (error) {
      let message
      if (error instanceof Error) message = error.message
      else message = String(error)
      if (message === 'invalid_credentials') {
        setError(message)
      } else {
        setError(message)
      }
    }
  }

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
      <Flex flexDir="column" w="376px" alignSelf="center" mt="6rem">
        {error && (
          <Alert mb="0.75rem" status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}
        <Flex
          flexDir="column"
          justifyContent="center"
          bg="white"
          p="2rem"
          border="1px solid gray.400"
          borderRadius="0.5rem"
        >
          <Text fontSize="2xl" fontWeight="400" mb="1.5rem" color="black">
            Sign in to Asset Sandbox
          </Text>

          <form
            onSubmit={handleSubmit(data => {
              onSubmit(data)
            })}
          >
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              placeholder="Email address"
              {...register('email')}
            />

            <FormLabel mt="1.5rem">Password</FormLabel>
            <Input
              placeholder="Password"
              type="password"
              {...register('password')}
            />

            <Button
              type="submit"
              variant="primary"
              mt="1.5rem"
              isLoading={loading}
            >
              Sign in
            </Button>
          </form>

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
    </Flex>
  )
}
