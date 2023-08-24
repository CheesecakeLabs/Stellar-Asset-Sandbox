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

import { toCrypto } from 'utils/formatter'

import { BalanceChart } from './components/balance-chart'
import { AssetHeader } from 'components/atoms'
import { SelectVault } from 'components/molecules/select-vault'

interface IDistributeAssetTemplate {
  onSubmit(
    data: FieldValues,
    setValue: UseFormSetValue<FieldValues>,
    wallet: string | undefined
  ): Promise<void>
  loading: boolean
  asset: Hooks.UseAssetsTypes.IAssetDto
  vaults: Hooks.UseVaultsTypes.IVault[] | undefined
  assetData: Hooks.UseHorizonTypes.IAsset | undefined
}

export const DistributeAssetTemplate: React.FC<IDistributeAssetTemplate> = ({
  onSubmit,
  loading,
  asset,
  vaults,
  assetData,
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm()
  const [wallet, setWallet] = useState<string | undefined>()

  return (
    <Flex flexDir="column" w="full">
      <Container variant="primary" justifyContent="center" p="0" maxW="full">
        <AssetHeader asset={asset} />
        <Box p="1rem">
          <form
            onSubmit={handleSubmit(data => {
              onSubmit(data, setValue, wallet)
            })}
          >
            <FormControl
              isInvalid={errors?.destination_wallet_id !== undefined}
            >
              <FormLabel>Destination Vault</FormLabel>
              <SelectVault vaults={vaults} setWallet={setWallet} />
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

            <Text
              color="gray.900"
              fontWeight="600"
              fontSize="xs"
              mt="0.5rem"
              ms="0.25rem"
            >
              {`Main Vault: ${
                assetData
                  ? `${toCrypto(Number(asset.distributorBalance?.balance))} ${
                      asset.code
                    }`
                  : 'loading'
              }`}
            </Text>

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

      <BalanceChart
        supply={Number(asset.assetData?.amount || 0)}
        mainVault={Number(asset.distributorBalance?.balance || 0)}
        assetCode={asset.code}
      />
    </Flex>
  )
}
