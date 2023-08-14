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
  VStack,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { FieldValues, UseFormSetValue, useForm } from 'react-hook-form'

import { getCurrencyIcon } from 'utils/constants/constants'
import { toCrypto } from 'utils/formatter'

import { SelectVault } from 'components/molecules/select-vault'

interface IDistributeVault {
  onSubmit(
    data: FieldValues,
    setValue: UseFormSetValue<FieldValues>,
    wallet: string | undefined
  ): Promise<void>
  loading: boolean
  vaults: Hooks.UseVaultsTypes.IVault[] | undefined
  vault: Hooks.UseVaultsTypes.IVault | undefined
  selectedAsset: Hooks.UseAssetsTypes.IAssetDto | undefined
}

export const DistributeVault: React.FC<IDistributeVault> = ({
  onSubmit,
  loading,
  vaults,
  vault,
  selectedAsset,
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm()
  const [wallet, setWallet] = useState<string | undefined>()

  const getBalance = (): string => {
    return (
      vault?.accountData?.balances.find(
        balance =>
          balance.asset_code === selectedAsset?.code &&
          balance.asset_issuer === selectedAsset.issuer.key.publicKey
      )?.balance || ''
    )
  }

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
            Transfer
          </Text>
        </Flex>
        <Box p="1rem">
          {selectedAsset ? (
            <form
              onSubmit={handleSubmit(data => {
                onSubmit(data, setValue, wallet)
              })}
            >
              <Flex
                fill="black"
                stroke="black"
                _dark={{ fill: 'white', stroke: 'white' }}
              >
                {getCurrencyIcon(selectedAsset.code, '2rem')}{' '}
                <Flex flexDir="column" ms="1rem">
                  <Text fontSize="sm">{selectedAsset.code}</Text>
                  <Text fontSize="xs">{toCrypto(Number(getBalance()))}</Text>
                </Flex>
              </Flex>

              <FormControl mt="1.5rem">
                <FormLabel>Destination Vault</FormLabel>
                <SelectVault
                  vaults={vaults}
                  setWallet={setWallet}
                  distributorWallet={selectedAsset.distributor.key.publicKey}
                />
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
          ) : (
            <VStack minH="4rem" justifyContent="center">
              <Text
                color="gray.650"
                fontSize="sm"
                fontWeight="700"
                _dark={{ color: 'white' }}
              >
                Select the asset
              </Text>
            </VStack>
          )}
        </Box>
      </Container>
    </Flex>
  )
}
