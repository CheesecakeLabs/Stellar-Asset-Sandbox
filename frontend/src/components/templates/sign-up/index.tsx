import {
  Alert,
  AlertIcon,
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Text,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'

import { Loading } from 'components/atoms'
import { SwitchTheme } from 'components/molecules'

import { ReactComponent as StellarLogo } from 'app/core/resources/stellar.svg'

interface ISignUpTemplate {
  handleSignUp(params: Hooks.UseAuthTypes.ISignUp): Promise<void>
  loading: boolean
  roles: Hooks.UseAuthTypes.IRole[] | undefined
  loadingRoles: boolean
}

export const SignUpTemplate: React.FC<ISignUpTemplate> = ({
  handleSignUp,
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
      setError('confirmPassword', { message: 'The passwords do not match' })
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
    <Flex w="full" pt="1.5rem" px="2rem" flexDir="column" h="100vh">
      <Flex
        w="full"
        justifyContent="space-between"
        fill="black"
        _dark={{ fill: 'white' }}
      >
        <StellarLogo width="300px" />
        <SwitchTheme />
      </Flex>
      <Flex flexDir="column" w="376px" alignSelf="center" mt="6rem" pb="1rem">
        {errorSubmit && (
          <Alert mb="0.75rem" status="error">
            <AlertIcon />
            {errorSubmit}
          </Alert>
        )}
        <Container variant="primary" justifyContent="center" p="2rem">
          <Text fontSize="2xl" fontWeight="400" mb="1.5rem">
            Create an account
          </Text>
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
                  autoComplete='off'
                  {...register('name', {
                    required: true,
                    minLength: 3,
                    maxLength: 25,
                  })}
                />
                <FormErrorMessage>
                  Name must be between 2 and 25 characters long”
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors?.email !== undefined}>
                <FormLabel mt="1.5rem">Email address</FormLabel>
                <Input
                  type="email"
                  placeholder="Email address"
                  autoComplete='off'
                  {...register('email', { required: true })}
                />
                <FormErrorMessage>Email is required</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors?.password !== undefined}>
                <FormLabel mt="1.5rem">Password</FormLabel>
                <Input
                  placeholder="Password"
                  type="password"
                  {...register('password', {
                    required: true,
                    minLength: 6,
                    maxLength: 16,
                  })}
                />
                <FormErrorMessage>
                  Password must be between 6 and 16 characters long
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
                    'The passwords do not match'}
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
                  <FormErrorMessage>Role is required</FormErrorMessage>
                </FormControl>
              )}

              <Button
                type="submit"
                variant="primary"
                mt="1.5rem"
                isLoading={loading}
              >
                Create account
              </Button>
            </form>
          )}
        </Container>
      </Flex>
    </Flex>
  )
}
