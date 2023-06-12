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

import { ReactComponent as StellarLogo } from 'app/core/resources/stellar.svg'

interface ISignUpTemplate {
  handleSignUp(params: Hooks.UseAuthTypes.ISignUp): Promise<void>
  loading: boolean
}

export const SignUpTemplate: React.FC<ISignUpTemplate> = ({
  handleSignUp,
  loading,
}) => {
  const [error, setError] = useState<string | null>(null)
  const { register, handleSubmit } = useForm()

  const onSubmit = async (data: FieldValues): Promise<void> => {
    setError(null)
    try {
      await handleSignUp({
        email: data.email,
        password: data.password,
        name: data.name,
        role_id: 2,
      })
    } catch (error) {
      let message
      if (error instanceof Error) message = error.message
      else message = String(error)
      setError(message)
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
          <Text fontSize="2xl" fontWeight="400" mb="0.5rem" color="black">
            Create an account
          </Text>
          <Text fontSize="sm" fontWeight="400" mb="1.5rem" color="black">
            You were invited by tomer@stellar.org
          </Text>

          <form
            onSubmit={handleSubmit(data => {
              onSubmit(data)
            })}
          >
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              placeholder="Name"
              {...register('name', { required: 'Informe' })}
            />

            <FormLabel mt="1.5rem">Email address</FormLabel>
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

            <FormLabel mt="1.5rem">Confirm password</FormLabel>
            <Input placeholder="Confirm password" type="password" />

            <Button
              type="submit"
              variant="primary"
              mt="1.5rem"
              isLoading={loading}
            >
              Create account
            </Button>
          </form>
        </Flex>
      </Flex>
    </Flex>
  )
}
