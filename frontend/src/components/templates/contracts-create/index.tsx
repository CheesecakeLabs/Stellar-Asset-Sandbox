import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  Skeleton,
  Text,
  VStack,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'

import { newContractHelper } from 'utils/constants/helpers'
import { MAX_PAGE_WIDTH } from 'utils/constants/sizes'
import { toNumber } from 'utils/formatter'

import { SelectCompound, CompoundTime } from './components/select-compound'
import {
  SelectCompoundType,
  TSelectCompoundType,
} from './components/select-compound-type'
import { SelectVault } from './components/select-vault'
import { ActionHelper } from 'components/molecules/action-helper'
import { ContractsBreadcrumb } from 'components/molecules/contracts-breadcrumb'
import { SelectAsset } from 'components/molecules/select-asset'

interface IContractsCreateTemplate {
  onSubmit(
    data: FieldValues,
    asset: Hooks.UseAssetsTypes.IAssetDto,
    vault: Hooks.UseVaultsTypes.IVault,
    compoundType: TSelectCompoundType,
    compound: number
  ): Promise<void>
  loading: boolean
  vaults: Hooks.UseVaultsTypes.IVault[] | undefined
  assets: Hooks.UseAssetsTypes.IAssetDto[] | undefined
  creatingContract: boolean
}

export const ContractsCreateTemplate: React.FC<IContractsCreateTemplate> = ({
  onSubmit,
  loading,
  vaults,
  assets,
  creatingContract,
}) => {
  const [errorSubmit] = useState<string | null>(null)
  const [vault, setVault] = useState<Hooks.UseVaultsTypes.IVault>()
  const [asset, setAsset] = useState<
    Hooks.UseAssetsTypes.IAssetDto | undefined
  >()
  const [compound, setCompound] = useState<CompoundTime>(CompoundTime['10 min'])
  const [compoundType, setCompoundType] =
    useState<TSelectCompoundType>('Simple interest')

  const {
    handleSubmit,
    setValue,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm()

  const filteredAssets = (): Hooks.UseAssetsTypes.IAssetDto[] | undefined => {
    return (
      assets?.filter(asset =>
        vault?.accountData?.balances.some(
          balance =>
            asset.code === balance.asset_code &&
            asset.issuer.key.publicKey === balance.asset_issuer
        )
      ) || []
    )
  }

  const handleForm = (data: FieldValues): void => {
    let hasError = false

    if (!vault) {
      setError('vault', { message: 'This field is required' })
      hasError = true
    }
    if (!asset) {
      setError('asset', { message: 'This field is required' })
      hasError = true
    }
    if (!data.min_deposit) {
      setError('min_deposit', { message: 'This field is required' })
      hasError = true
    }
    if (!data.term) {
      setError('term', { message: 'This field is required' })
      hasError = true
    }
    if (!data.term) {
      setError('yield_rate', { message: 'This field is required' })
      hasError = true
    }
    if (!data.term) {
      setError('penalty_rate', { message: 'This field is required' })
      hasError = true
    }

    if (!hasError && vault && asset) {
      onSubmit(data, asset, vault, compoundType, compound)
    }
  }

  return (
    <Flex
      flexDir={{ base: 'column', md: 'row' }}
      gap="1.5rem"
      w="full"
      justifyContent="center"
    >
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
              New Certificate of Deposit
            </Text>
          </Flex>
          {loading ? (
            <Skeleton w="full" h="16rem" />
          ) : (
            <Box p="1rem">
              <form onSubmit={handleSubmit(data => handleForm(data))}>
                <Flex flexDir={{ base: 'column', md: 'row' }} gap="1.5rem">
                  <FormControl isInvalid={errors?.vault !== undefined}>
                    <FormLabel>Vault*</FormLabel>
                    <SelectVault
                      vaults={vaults}
                      setVault={setVault}
                      clearErrors={(): void => {
                        clearErrors('vault')
                      }}
                    />
                    <FormErrorMessage>
                      {errors?.vault?.message?.toString()}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={errors?.asset !== undefined}>
                    <FormLabel>Asset*</FormLabel>
                    <SelectAsset
                      assets={filteredAssets()}
                      setAsset={setAsset}
                      clearErrors={(): void => {
                        clearErrors('asset')
                      }}
                    />
                    <FormErrorMessage>
                      {errors?.asset?.message?.toString()}
                    </FormErrorMessage>
                  </FormControl>
                </Flex>

                <Flex
                  flexDir={{ base: 'column', md: 'row' }}
                  gap="1.5rem"
                  mt="1.5rem"
                >
                  <Flex
                    w="full"
                    flexDir={{ base: 'column', md: 'row' }}
                    gap="1.5rem"
                  >
                    <FormControl isInvalid={errors?.min_deposit !== undefined}>
                      <FormLabel>Minimum Deposit*</FormLabel>
                      <Input
                        as={NumericFormat}
                        decimalScale={7}
                        thousandSeparator=","
                        placeholder="Minimum deposit"
                        autoComplete="off"
                        value={getValues('min_deposit')}
                        onChange={(event): void => {
                          clearErrors('min_deposit')
                          setValue('min_deposit', toNumber(event.target.value))
                        }}
                      />
                      <FormErrorMessage>
                        {errors?.min_deposit?.message?.toString()}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={errors?.term !== undefined}>
                      <FormLabel>Term*</FormLabel>
                      <InputGroup>
                        <Input
                          as={NumericFormat}
                          placeholder="day(s)"
                          decimalScale={0}
                          autoComplete="off"
                          value={getValues('term')}
                          onChange={(event): void => {
                            clearErrors('term')
                            setValue('term', toNumber(event.target.value))
                          }}
                        />
                        <InputRightAddon children="days" />
                      </InputGroup>
                      <FormErrorMessage>
                        {errors?.term?.message?.toString()}
                      </FormErrorMessage>
                    </FormControl>
                  </Flex>

                  <Flex
                    w="full"
                    flexDir={{ base: 'column', md: 'row' }}
                    gap="1.5rem"
                  >
                    <FormControl isInvalid={errors?.yield_rate !== undefined}>
                      <FormLabel>Yield Rate*</FormLabel>
                      <InputGroup>
                        <Input
                          as={NumericFormat}
                          decimalScale={2}
                          autoComplete="off"
                          placeholder="Yield Rate"
                          onChange={(event): void => {
                            clearErrors('yield_rate')
                            setValue('yield_rate', toNumber(event.target.value))
                          }}
                        />
                        <InputRightAddon children="%" />
                      </InputGroup>
                      <FormErrorMessage>
                        {errors?.yield_rate?.message?.toString()}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={errors?.penalty_rate !== undefined}>
                      <FormLabel>Penalty rate*</FormLabel>
                      <InputGroup>
                        <Input
                          as={NumericFormat}
                          decimalScale={2}
                          thousandSeparator=","
                          placeholder="Penalty rate"
                          autoComplete="off"
                          value={getValues('penalty_rate')}
                          onChange={(event): void => {
                            clearErrors('penalty_rate')
                            setValue(
                              'penalty_rate',
                              toNumber(event.target.value)
                            )
                          }}
                        />
                        <InputRightAddon children="%" />
                      </InputGroup>
                      <FormErrorMessage>
                        {errors?.penalty_rate?.message?.toString()}
                      </FormErrorMessage>
                    </FormControl>
                  </Flex>
                </Flex>

                <Flex
                  flexDir={{ base: 'column', md: 'row' }}
                  gap="1.5rem"
                  mt="1.5rem"
                  bg="gray.50"
                  p="1rem"
                  borderRadius="0.25rem"
                  _dark={{ bg: 'black.600' }}
                >
                  <FormControl w="full">
                    <FormLabel>Compound*</FormLabel>
                    <SelectCompoundType
                      compoundType={compoundType}
                      setCompoundType={setCompoundType}
                    />
                    {compoundType === 'Compound interest' && (
                      <SelectCompound
                        compound={compound}
                        setCompound={setCompound}
                      />
                    )}
                  </FormControl>

                  <Flex w="full" flexDir="column" pt="1.5rem" gap="0.5rem">
                    <Text fontSize="sm">
                      <b>Simple Interest:</b> Interest payment based on a
                      percentage of the deposited amount over the term period.
                    </Text>
                    <Text fontSize="sm">
                      <b>Compound interest:</b> Interest earned not just based
                      on the deposited amount, but also on the interest already
                      earned so far at each compound interval.
                    </Text>
                  </Flex>
                </Flex>

                <Flex justifyContent="flex-end" mt="1rem">
                  <Button
                    type="submit"
                    w={{ base: 'full', md: 'fit-content' }}
                    variant="primary"
                    mt="1.5rem"
                    isLoading={creatingContract}
                  >
                    Create Certificate of Deposit
                  </Button>
                </Flex>
              </form>
            </Box>
          )}
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
