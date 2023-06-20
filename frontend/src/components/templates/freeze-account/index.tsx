import {
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from '@chakra-ui/react'
import React from 'react'
import { FieldValues, UseFormSetValue, useForm } from 'react-hook-form'

interface IFreezeAccountTemplate {
  onSubmit(
    data: FieldValues,
    setValue: UseFormSetValue<FieldValues>
  ): Promise<void>
  loading: boolean
}

export const FreezeAccountTemplate: React.FC<IFreezeAccountTemplate> = ({
  onSubmit,
  loading,
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm()

  return (
    <Flex flexDir="column" w="full">
      <Container variant="primary" justifyContent="center" p="2rem" maxW="full">
        <form
          onSubmit={handleSubmit(data => {
            onSubmit(data, setValue)
          })}
        >
          <FormControl isInvalid={errors?.trustor_id !== undefined}>
            <FormLabel>Wallet</FormLabel>
            <Input
              type="text"
              placeholder="Wallet"
              {...register('trustor_id', {
                required: true,
              })}
            />
            <FormErrorMessage>Required</FormErrorMessage>
          </FormControl>
          <Flex gap={4}>
            <Button
              type="submit"
              variant="primary"
              mt="1.5rem"
              isLoading={loading}
            >
              Freeze
            </Button>
            <Button
              type="submit"
              variant="secondary"
              mt="1.5rem"
              isLoading={loading}
            >
              Unfreeze
            </Button>
          </Flex>
        </form>
      </Container>
    </Flex>
  )
}
