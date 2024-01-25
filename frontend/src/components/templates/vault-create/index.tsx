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
  Text,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'

import { SelectAssets } from './select-assets'
import { SelectCategory } from './select-category'

export interface IOption {
  readonly label: string
  readonly value: number
}

interface IVaultCreateTemplate {
  onSubmit(
    name: string,
    vaultCategoryId: number,
    assetsId: number[]
  ): Promise<void>
  loading: boolean
  vaultCategories: Hooks.UseVaultsTypes.IVaultCategory[] | undefined
  assets: Hooks.UseAssetsTypes.IAssetDto[] | undefined
  createVaultCategory(
    vaultCategory: Hooks.UseVaultsTypes.IVaultCategoryRequest
  ): Promise<Hooks.UseVaultsTypes.IVaultCategory | undefined>
}

export const VaultCreateTemplate: React.FC<IVaultCreateTemplate> = ({
  onSubmit,
  loading,
  vaultCategories,
  assets,
  createVaultCategory,
}) => {
  const [errorSubmit] = useState<string | null>(null)
  const [categorySelected, setCategorySelected] = useState<
    IOption | undefined | null
  >()
  const [assetsSelecteds, setAssetsSelecteds] = useState<number[]>([])

  const {
    handleSubmit,
    register,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm()

  const handleForm = (data: FieldValues): void => {
    let hasError = false

    if (!categorySelected) {
      setError('category', { message: 'This field is required' })
      hasError = true
    }

    if (!hasError && categorySelected) {
      onSubmit(data.name, categorySelected.value, assetsSelecteds)
    }
  }

  return (
    <Flex flexDir="column" w="full">
      <Flex maxW="584px" alignSelf="center" flexDir="column" w="full">
        <Text fontSize="2xl" fontWeight="400" mb="1.5rem">
          Create Vault
        </Text>
        {errorSubmit && (
          <Alert mb="0.75rem" status="error">
            <AlertIcon />
            {errorSubmit}
          </Alert>
        )}
        <Container variant="primary" justifyContent="center" p="2rem">
          <form onSubmit={handleSubmit(data => handleForm(data))}>
            <FormControl isInvalid={errors?.name !== undefined}>
              <FormLabel>Vault name</FormLabel>
              <Input
                type="text"
                placeholder="Vault name"
                autoComplete="off"
                {...register('name', {
                  required: true,
                })}
              />
              <FormErrorMessage>Vault name must be between 2 and 48 characters long</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors?.category !== undefined}>
              {vaultCategories && (
                <>
                  <FormLabel mt="1.5rem">Vault category</FormLabel>
                  <SelectCategory
                    vaultCategories={vaultCategories}
                    createVaultCategory={createVaultCategory}
                    setCategorySelected={setCategorySelected}
                    clearErrors={(): void => {
                      clearErrors('category')
                    }}
                  />
                </>
              )}
              <FormErrorMessage>
                {errors?.category?.message?.toString()}
              </FormErrorMessage>
            </FormControl>

            {assets && (
              <>
                <FormLabel mt="1.5rem">Assets</FormLabel>
                <SelectAssets
                  assets={assets}
                  setAssetsSelecteds={setAssetsSelecteds}
                  assetsSelecteds={assetsSelecteds}
                />
              </>
            )}

            <Flex justifyContent="flex-end" mt="1rem">
              <Button
                type="submit"
                variant="primary"
                mt="1.5rem"
                isLoading={loading}
              >
                Create vault
              </Button>
            </Flex>
          </form>
        </Container>
      </Flex>
    </Flex>
  )
}
