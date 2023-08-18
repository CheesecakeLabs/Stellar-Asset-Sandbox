import {
  Alert,
  AlertIcon,
  Button,
  Container,
  Flex,
  FormLabel,
  Input,
  Text,
} from '@chakra-ui/react'
import React, { useState } from 'react'

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
  const [name, setName] = useState<string>()
  const [categorySelected, setCategorySelected] = useState<
    IOption | undefined | null
  >()
  const [assetsSelecteds, setAssetsSelecteds] = useState<number[]>([])

  const submit = (): void => {
    if (!name || !categorySelected || !assetsSelecteds) return
    onSubmit(name, categorySelected.value, assetsSelecteds)
  }

  const handleName = (event: {
    target: { name: string; value: string }
  }): void => {
    setName(event.target.value)
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
          <FormLabel>Vault name</FormLabel>
          <Input
            type="text"
            placeholder="Vault name"
            autoComplete="off"
            onChange={handleName}
          />

          {vaultCategories && (
            <>
              <FormLabel mt="1.5rem">Vault category</FormLabel>
              <SelectCategory
                vaultCategories={vaultCategories}
                createVaultCategory={createVaultCategory}
                setCategorySelected={setCategorySelected}
              />
            </>
          )}

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
              onClick={submit}
            >
              Create vault
            </Button>
          </Flex>
        </Container>
      </Flex>
    </Flex>
  )
}
