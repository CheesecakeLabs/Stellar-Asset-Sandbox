import {
  AbsoluteCenter,
  Alert,
  AlertIcon,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Text,
} from '@chakra-ui/react'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'

import { Loading } from 'components/atoms'
import { SwitchTheme } from 'components/molecules'

interface ISignUp {
  handleSignUp(params: Hooks.UseAuthTypes.ISignUp): Promise<void>
  setIsSignIn: Dispatch<SetStateAction<boolean>>
  loading: boolean
  roles: Hooks.UseAuthTypes.IRole[] | undefined
  loadingRoles: boolean
}

export const SignUp: React.FC<ISignUp> = ({
  handleSignUp,
  setIsSignIn,
  loading,
  roles,
  loadingRoles,
}) => {
  const [errorSubmit, setErrorSubmit] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data: FieldValues): Promise<void> => {
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', { message: 'The passwords are not the same' })
      return
    }

    setErrorSubmit(null)
    try {
      await handleSignUp({
        email: data.email,
        password: data.password,
        name: data.name,
        role_id: Number(data.role_id),
      })
    } catch (error) {
      let message
      if (error instanceof Error) message = error.message
      else message = String(error)
      setErrorSubmit(message)
    }
  }

  return (
    <Flex
      flexDir="column"
      maxW="480px"
      w="full"
      bg="white"
      _dark={{ bg: 'black.800' }}
      h="100vh"
      p="2rem"
    >
      <Flex flexDir="column">
        {errorSubmit && (
          <Alert mb="0.75rem" status="error">
            <AlertIcon />
            {errorSubmit}
          </Alert>
        )}
        <Flex justifyContent="space-between">
          <Text fontSize="2xl" fontWeight="400" mb="3rem">
            Create an account
          </Text>
          <Box>
            <SwitchTheme />
          </Box>
        </Flex>
        {loadingRoles ? (
          <Loading />
        ) : (
          <form
            onSubmit={handleSubmit(data => {
              onSubmit(data)
            })}
          >
            <FormControl isInvalid={errors?.name !== undefined}>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                placeholder="Name"
                {...register('name', {
                  required: true,
                  minLength: 3,
                })}
                autoComplete='off'
              />
              <FormErrorMessage>
                Name must be more than 2 characters
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors?.email !== undefined}>
              <FormLabel mt="1.5rem">Email address</FormLabel>
              <Input
                type="email"
                placeholder="Email address"
                {...register('email', { required: true })}
                autoComplete='off'
              />
              <FormErrorMessage>Please check the email</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors?.password !== undefined}>
              <FormLabel mt="1.5rem">Password</FormLabel>
              <Input
                placeholder="Password"
                type="password"
                {...register('password', {
                  required: true,
                  minLength: 6,
                })}
              />
              <FormErrorMessage>
                Password must be at least 6 characters long
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors?.confirmPassword !== undefined}>
              <FormLabel mt="1.5rem">Confirm password</FormLabel>
              <Input
                placeholder="Confirm password"
                type="password"
                {...register('confirmPassword', { required: true })}
              />
              <FormErrorMessage>
                {errors?.confirmPassword?.message?.toString() ||
                  'Confirm your password'}
              </FormErrorMessage>
            </FormControl>

            {roles && (
              <FormControl isInvalid={errors?.role_id !== undefined}>
                <FormLabel mt="1.5rem">Role</FormLabel>
                <Select
                  placeholder="Select role"
                  {...register('role_id', { required: true })}
                >
                  {roles.map((role, index) => (
                    <option value={role.id} key={index}>
                      {role.name}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>Inform the role</FormErrorMessage>
              </FormControl>
            )}

            <Button
              type="submit"
              variant="primary"
              mt="1.5rem"
              isLoading={loading}
              w="full"
              py="1.5rem"
            >
              Create account
            </Button>
          </form>
        )}

        <Box position="relative" my="2.5rem">
          <Divider />
          <AbsoluteCenter px="4">
            <Text variant="secondary">Or</Text>
          </AbsoluteCenter>
        </Box>

        <Flex gap={1} justifyContent="center">
          <Text fontSize="md">Already have an account?</Text>
          <Button
            variant="link"
            fontSize="md"
            color="primary.normal"
            fontWeight="500"
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
