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
  InputGroup,
  InputRightAddon,
  Skeleton,
  Text,
  VStack,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { FieldValues, UseFormSetValue, useForm } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'

import { newContractHelper } from 'utils/constants/helpers'
import { MAX_PAGE_WIDTH } from 'utils/constants/sizes'
import { toNumber } from 'utils/formatter'

import { SelectVault } from './components/select-vault'
import { ActionHelper } from 'components/molecules/action-helper'
import { ContractsBreadcrumb } from 'components/molecules/contracts-breadcrumb'
import { SelectAsset } from 'components/molecules/select-asset'
import { SelectCompound, CompoundTime } from './components/select-compound'
import { SelectCompoundType, TSelectCompoundType } from './components/select-compound-type'

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
  const [compoundType, setCompoundType] = useState<TSelectCompoundType>('Simple interest')

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
              New Certificate of Deposit
            </Text>
          </Flex>
          {loading ? <Skeleton w="full" h="16rem" /> : <Box p="1rem">
            <form
              onSubmit={handleSubmit(data => {
                if (!asset || !vault) return
                onSubmit(data, asset, vault, compoundType, compound)
              })}
            >
              <Flex flexDir={{ md: 'row', sm: 'column' }} gap="1.5rem">
                <FormControl>
                  <FormLabel>Vault</FormLabel>
                  <SelectVault vaults={vaults} setVault={setVault} />
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
                <Flex w="full" flexDir={{ md: 'row', sm: 'column' }} gap="1.5rem">
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

                  <FormControl>
                    <FormLabel>Term</FormLabel>
                    <InputGroup>
                      <Input
                        type="number"
                        placeholder="Term"
                        {...register('term', {
                          required: true,
                        })}
                      />
                      <InputRightAddon children='days' />
                    </InputGroup>
                  </FormControl>
                </Flex>

                <Flex w="full" flexDir={{ md: 'row', sm: 'column' }} gap="1.5rem">
                  <FormControl>
                    <FormLabel>Yield Rate</FormLabel>
                    <InputGroup>
                      <Input
                        type="number"
                        placeholder="Yield Rate"
                        {...register('yield_rate', {
                          required: true,
                        })}
                      />
                      <InputRightAddon children='%' />
                    </InputGroup>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Penalty rate</FormLabel>
                    <InputGroup>
                      <Input
                        as={NumericFormat}
                        decimalScale={7}
                        thousandSeparator=","
                        placeholder="Penalty rate"
                        autoComplete="off"
                        value={getValues('penalty_rate')}
                        onChange={(event): void => {
                          setValue('penalty_rate', toNumber(event.target.value))
                        }}
                      />
                      <InputRightAddon children='%' />
                    </InputGroup>

                  </FormControl>
                </Flex>
              </Flex>

              <Flex
                flexDir={{ md: 'row', sm: 'column' }}
                gap="1.5rem"
                mt="1.5rem"
                bg="gray.50"
                p="1rem"
                borderRadius="0.25rem"
                _dark={{ bg: 'black.600' }}
              >
                <FormControl w="full">
                  <FormLabel>Compound</FormLabel>
                  <SelectCompoundType compoundType={compoundType} setCompoundType={setCompoundType} />
                  {compoundType === 'Compound interest' && <SelectCompound compound={compound} setCompound={setCompound} />}
                </FormControl>

                <Flex w="full" flexDir="column" pt="1.5rem" mx="1rem" gap="0.5rem">
                  <Text fontSize="sm"><b>Simple Interest:</b> Interest payment based on a percentage of the deposited amount over the term period.</Text>
                  <Text fontSize="sm"><b>Compound interest:</b> Interest earned not just based on the deposited amount, but also on the interest already earned so far at each compound interval.</Text>
                </Flex>
              </Flex>

              <Flex justifyContent="flex-end" mt="1rem">
                <Button
                  type="submit"
                  variant="primary"
                  mt="1.5rem"
                  isLoading={creatingContract}
                >
                  Create Certificate of Deposit
                </Button>
              </Flex>
            </form>
          </Box>}
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
