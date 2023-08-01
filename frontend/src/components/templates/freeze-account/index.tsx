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
import React, { useState } from 'react'
import { FieldValues, UseFormSetValue, useForm } from 'react-hook-form'

import { AssetHeader } from 'components/atoms'

interface IFreezeAccountTemplate {
  onSubmit(
    data: FieldValues,
    clearFlags: string[],
    setFlags: string[],
    setValue: UseFormSetValue<FieldValues>
  ): Promise<void>
  loading: boolean
  asset: Hooks.UseAssetsTypes.IAssetDto
}

export const FreezeAccountTemplate: React.FC<IFreezeAccountTemplate> = ({
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

  const [loadingFreeze, setLoadingFreeze] = useState(false)
  const [loadingUnfreeze, setLoadingUnfreeze] = useState(false)

  const freeze = (data: FieldValues): void => {
    setLoadingUnfreeze(false)
    setLoadingFreeze(true)
    onSubmit(data, ['TRUST_LINE_AUTHORIZED'], [], setValue)
  }

  const unfreeze = (data: FieldValues): void => {
    setLoadingFreeze(false)
    setLoadingUnfreeze(true)
    onSubmit(data, [], ['TRUST_LINE_AUTHORIZED'], setValue)
  }

  return (
    <Flex flexDir="column" w="full">
      <Container variant="primary" justifyContent="center" p="0" maxW="full">
        <AssetHeader asset={asset} />
        <Box p="1rem">
          <FormControl isInvalid={errors?.trustor_id !== undefined}>
            <FormLabel>Wallet</FormLabel>
            <Input
              type="text"
              placeholder="Wallet"
              {...register('trustor_pk', {
                required: true,
              })}
            />
            <FormErrorMessage>Required</FormErrorMessage>
          </FormControl>
          <Flex gap={4} justifyContent="flex-end">
            <Button
              type="submit"
              variant="primary"
              mt="1.5rem"
              isLoading={loading && loadingFreeze}
              onClick={handleSubmit(data => {
                freeze(data)
              })}
            >
              Freeze
            </Button>
            <Button
              type="submit"
              variant="secondary"
              mt="1.5rem"
              isLoading={loading && loadingUnfreeze}
              onClick={handleSubmit(data => {
                unfreeze(data)
              })}
            >
              Unfreeze
            </Button>
          </Flex>
        </Box>
      </Container>
    </Flex>
  )
}
