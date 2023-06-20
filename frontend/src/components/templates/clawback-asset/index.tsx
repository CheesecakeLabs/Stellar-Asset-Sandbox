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

interface IClawbackAssetTemplate {
  onSubmit(
    data: FieldValues,
    setValue: UseFormSetValue<FieldValues>
  ): Promise<void>
  loading: boolean
}

export const ClawbackAssetTemplate: React.FC<IClawbackAssetTemplate> = ({
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
          <FormControl isInvalid={errors?.destination_wallet_id !== undefined}>
            <FormLabel>Wallet</FormLabel>
            <Input
              type="text"
              placeholder="Wallet"
              {...register('from', {
                required: true,
              })}
            />
            <FormErrorMessage>Required</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors?.amount !== undefined} mt="1.5rem">
            <FormLabel>Amount</FormLabel>
            <Input
              type="number"
              placeholder="Amount"
              autoComplete="off"
              {...register('amount', {
                required: true,
              })}
            />
            <FormErrorMessage>Required</FormErrorMessage>
          </FormControl>

          <Button
            type="submit"
            variant="primary"
            mt="1.5rem"
            isLoading={loading}
          >
            Clawback
          </Button>
        </form>
      </Container>
    </Flex>
  )
}
