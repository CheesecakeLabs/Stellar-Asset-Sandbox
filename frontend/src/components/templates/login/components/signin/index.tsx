import {
  AbsoluteCenter,
  Alert,
  AlertIcon,
  Box,
  Button,
  Divider,
  Flex,
  FormLabel,
  Input,
  Text,
} from '@chakra-ui/react'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'

import { PathRoute } from 'components/enums/path-route'
import { SwitchTheme } from 'components/molecules'

interface ISignInTemplate {
  handleLogin(params: Hooks.UseAuthTypes.ISignIn): Promise<void>
  setIsSignIn: Dispatch<SetStateAction<boolean>>
  loading: boolean
}

export const SignIn: React.FC<ISignInTemplate> = ({
  handleLogin,
  setIsSignIn,
  loading,
}) => {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const { register, handleSubmit } = useForm()
  const { expired } = useParams()

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
      flexDir="column"
      maxW="480px"
      w="full"
      bg="white"
      _dark={{ bg: 'black.800', boxShadow: 'none' }}
      h="100vh"
      p="2rem"
      boxShadow="-5px 0px 10px #f1f1f1"
    >
      {error && (
        <Alert mb="0.75rem" status="error" variant="purple">
          <AlertIcon />
          {error}
        </Alert>
      )}
      {expired && (
        <Alert mb="0.75rem" status="info" variant="purple">
          <AlertIcon />
          Your session timed out, please login again
        </Alert>
      )}
      <Flex flexDir="column">
        <Flex justifyContent="space-between">
          <Text fontSize="2xl" fontWeight="400" mb="3rem">
            Sign in to Asset Sandbox
          </Text>
          <Box>
            <SwitchTheme />
          </Box>
        </Flex>

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
            w="full"
            py="1.5rem"
          >
            Sign in
          </Button>
        </form>

        <Box position="relative" my="2.5rem">
          <Divider />
          <AbsoluteCenter px="4">
            <Text variant="secondary">Or</Text>
          </AbsoluteCenter>
        </Box>

        {false && (
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
        )}

        <Flex gap={1} justifyContent="center">
          <Text fontSize="md">Don't have an account?</Text>
          <Button
            variant="link"
            fontSize="md"
            color="primary.normal"
            fontWeight="500"
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
