import {
  Box,
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

import { AssetHeader } from 'components/atoms'

interface IDistributeAssetTemplate {
  onSubmit(
    data: FieldValues,
    setValue: UseFormSetValue<FieldValues>
  ): Promise<void>
  loading: boolean
  asset: Hooks.UseAssetsTypes.IAssetDto
}

export const DistributeAssetTemplate: React.FC<IDistributeAssetTemplate> = ({
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
      <Container variant="primary" justifyContent="center" p="0" maxW="full">
        <AssetHeader asset={asset} />
        <Box p="1rem">
          <form
            onSubmit={handleSubmit(data => {
              onSubmit(data, setValue)
            })}
          >
            <FormControl
              isInvalid={errors?.destination_wallet_id !== undefined}
            >
              <FormLabel>Destination Vault</FormLabel>
              <Input
                type="text"
                placeholder="Wallet"
                {...register('destination_wallet_id', {
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

            <Flex justifyContent="flex-end">
              <Button
                type="submit"
                variant="primary"
                mt="1.5rem"
                isLoading={loading}
              >
                Distribute asset
              </Button>
            </Flex>
          </form>
        </Box>
      </Container>
    </Flex>
  )
}
