import {
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
} from '@chakra-ui/react'
import React from 'react'
import { FieldValues, UseFormSetValue, useForm } from 'react-hook-form'

interface IMintAssetTemplate {
  onSubmit(
    data: FieldValues,
    setValue: UseFormSetValue<FieldValues>
  ): Promise<void>
  loading: boolean
  asset: Hooks.UseAssetsTypes.IAssetDto
}

export const MintAssetTemplate: React.FC<IMintAssetTemplate> = ({
  onSubmit,
  loading,
  asset,
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
          <FormControl isInvalid={errors?.amount !== undefined}>
            <Flex justifyContent="space-between" w="full">
              <FormLabel>Amount</FormLabel>
              <Text color="gray.650" fontWeight="700" fontSize="xs">
                {`Circulation supply: ${asset.supply} ${asset.code}`}
              </Text>
            </Flex>
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
            Mint asset
          </Button>
        </form>
      </Container>
    </Flex>
  )
}
