import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { FieldValues, UseFormSetValue, useForm } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'

import { newContractHelper } from 'utils/constants/helpers'
import { MAX_PAGE_WIDTH } from 'utils/constants/sizes'
import { toNumber } from 'utils/formatter'

import { ActionHelper } from 'components/molecules/action-helper'
import { ContractsBreadcrumb } from 'components/molecules/contracts-breadcrumb'
import { SelectAsset } from 'components/molecules/select-asset'
import { SelectVault } from 'components/molecules/select-vault'

interface IContractsCreateTemplate {
  onSubmit(
    data: FieldValues,
    setValue: UseFormSetValue<FieldValues>,
    walletVault: string | undefined,
    asset: Hooks.UseAssetsTypes.IAssetDto | undefined
  ): Promise<void>
  loading: boolean
  vaults: Hooks.UseVaultsTypes.IVault[] | undefined
  assets: Hooks.UseAssetsTypes.IAssetDto[] | undefined
}

export const ContractsCreateTemplate: React.FC<IContractsCreateTemplate> = ({
  onSubmit,
  loading,
  vaults,
  assets,
}) => {
  const [errorSubmit] = useState<string | null>(null)
  const [walletVault, setWalletVault] = useState<string>()
  const [asset, setAsset] = useState<
    Hooks.UseAssetsTypes.IAssetDto | undefined
  >()

  const { handleSubmit, setValue, getValues, register } = useForm()

  return (
    <Flex flexDir="row" gap="1.5rem" w="full" justifyContent="center">
      <Flex maxW={MAX_PAGE_WIDTH} alignSelf="center" flexDir="column" w="full">
        <ContractsBreadcrumb title="New Contract" />
        {errorSubmit && (
          <Alert mb="0.75rem" status="error">
            <AlertIcon />
            {errorSubmit}
          </Alert>
        )}
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
              New Contract
            </Text>
          </Flex>
          <Box p="1rem">
            <form
              onSubmit={handleSubmit(data => {
                onSubmit(data, setValue, walletVault, asset)
              })}
            >
              <Flex flexDir={{ md: 'row', sm: 'column' }} gap="1.5rem">
                <FormControl>
                  <FormLabel>Vault</FormLabel>
                  <SelectVault vaults={vaults} setWallet={setWalletVault} />
                </FormControl>

                <FormControl>
                  <FormLabel>Asset</FormLabel>
                  <SelectAsset assets={assets} setAsset={setAsset} />
                </FormControl>
              </Flex>

              <Flex
                flexDir={{ md: 'row', sm: 'column' }}
                gap="1.5rem"
                mt="1.5rem"
              >
                <FormControl>
                  <FormLabel>Yield Rate</FormLabel>
                  <Input
                    type="number"
                    placeholder="Yield Rate (%)"
                    {...register('yield_rate', {
                      required: true,
                    })}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Minimum Deposit</FormLabel>
                  <Input
                    as={NumericFormat}
                    decimalScale={7}
                    thousandSeparator=","
                    placeholder="Minimum deposit"
                    autoComplete="off"
                    value={getValues('min_deposit')}
                    onChange={(event): void => {
                      setValue('min_deposit', toNumber(event.target.value))
                    }}
                  />
                </FormControl>
              </Flex>

              <Flex
                flexDir={{ md: 'row', sm: 'column' }}
                gap="1.5rem"
                mt="1.5rem"
              >
                <FormControl>
                  <FormLabel>Term</FormLabel>
                  <Input
                    placeholder="Select Date and Time"
                    size="md"
                    type="datetime-local"
                    {...register('yield_rate', {
                      required: true,
                    })}
                  />
                </FormControl>
              </Flex>

              <Flex justifyContent="flex-end" mt="1rem">
                <Button
                  type="submit"
                  variant="primary"
                  mt="1.5rem"
                  isLoading={loading}
                >
                  Create Contract
                </Button>
              </Flex>
            </form>
          </Box>
        </Container>
      </Flex>
      <VStack mt="2.5rem">
        <ActionHelper
          title={'About Certificates'}
          description={newContractHelper}
        />
      </VStack>
    </Flex>
  )
}
