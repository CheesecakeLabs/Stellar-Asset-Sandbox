import { Alert, AlertIcon, Button, Container, Flex, FormControl, FormErrorMessage, FormLabel, Input, Select, Text, useColorMode } from '@chakra-ui/react';
import React, { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';



import { Loading } from 'components/atoms';
import { SwitchTheme } from 'components/molecules';



import { ReactComponent as StellarLogo } from 'app/core/resources/stellar.svg';


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
  const { colorMode } = useColorMode()

  const isDark = colorMode === 'dark'

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
    <Flex w="full" pt="1.5rem" px="2rem" flexDir="column" h="100vh">
      <Flex w="full" justifyContent="space-between">
        <StellarLogo fill={isDark ? 'white' : 'black'} width="300px" />
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
          <Text fontSize="2xl" fontWeight="400" mb="0.5rem">
            Create an account
          </Text>
          <Text fontSize="sm" fontWeight="400" mb="1.5rem">
            You were invited by tomer@stellar.org
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
                  {...register('name', {
                    required: true,
                    minLength: 3,
                  })}
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
                  {errors?.confirmPassword?.message?.toString() || 'Confirm your password'}
                </FormErrorMessage>
              </FormControl>

              {roles && (
                <FormControl isInvalid={errors?.role_id !== undefined}>
                  <FormLabel mt="1.5rem">Role</FormLabel>
                  <Select
                    placeholder="Select role"
                    {...register('role_id', { required: true })}
                  >
                    {roles.map(role => (
                      <option value={role.id}>{role.name}</option>
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