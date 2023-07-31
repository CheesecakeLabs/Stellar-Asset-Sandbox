import {
  Box,
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
import { FieldValues, UseFormSetValue, useForm } from 'react-hook-form'

import { SelectAsset } from 'components/molecules/select-asset'
import { SelectVault } from 'components/molecules/select-vault'

interface IDistributeVault {
  onSubmit(
    data: FieldValues,
    setValue: UseFormSetValue<FieldValues>,
    wallet: string | undefined,
    asset: Hooks.UseAssetsTypes.IAssetDto | undefined
  ): Promise<void>
  loading: boolean
  assets: Hooks.UseAssetsTypes.IAssetDto[] | undefined
  vaults: Hooks.UseVaultsTypes.IVault[] | undefined
}

export const DistributeVault: React.FC<IDistributeVault> = ({
  onSubmit,
  loading,
  assets,
  vaults,
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm()
  const [wallet, setWallet] = useState<string | undefined>()
  const [asset, setAsset] = useState<
    Hooks.UseAssetsTypes.IAssetDto | undefined
  >()

  return (
    <Flex flexDir="column" w="full">
      <Container variant="primary" justifyContent="center" p="0" maxW="full">
        <Flex
          alignItems="center"
          justifyContent="space-between"
          borderBottom="1px solid"
          borderColor={'gray.600'}
          h="3.5rem"
          px="1rem"
          fill="black"
          stroke="black"
          _dark={{ fill: 'white', stroke: 'white', borderColor: 'black.800' }}
        >
          <Text fontSize="sm" fontWeight="600">
            Distribute
          </Text>
        </Flex>
        <Box p="1rem">
          <form
            onSubmit={handleSubmit(data => {
              onSubmit(data, setValue, wallet, asset)
            })}
          >
            <FormControl>
              <FormLabel>Asset</FormLabel>
              <SelectAsset assets={assets} setAsset={setAsset} />
            </FormControl>

            <FormControl mt="1.5rem">
              <FormLabel>Destination Vault</FormLabel>
              <SelectVault vaults={vaults} setWallet={setWallet} />
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
