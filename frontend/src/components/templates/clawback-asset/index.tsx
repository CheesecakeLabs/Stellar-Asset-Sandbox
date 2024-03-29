import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Stack,
} from '@chakra-ui/react'
import React, { Dispatch, SetStateAction } from 'react'
import { FieldValues, UseFormSetValue, useForm } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'

import { toCrypto, toNumber } from 'utils/formatter'

import { AssetHeader } from 'components/atoms'
import { InfoTag } from 'components/atoms/info-tag'
import { SupplyTag } from 'components/atoms/supply-tag'
import { SelectVault } from 'components/molecules/select-vault'

interface IClawbackAssetTemplate {
  onSubmit(
    data: FieldValues,
    setValue: UseFormSetValue<FieldValues>,
    wallet: string | undefined
  ): Promise<void>
  setWallet: Dispatch<SetStateAction<string | undefined>>
  loading: boolean
  asset: Hooks.UseAssetsTypes.IAssetDto
  vaults: Hooks.UseVaultsTypes.IVault[] | undefined
  assetData: Hooks.UseHorizonTypes.IAsset | undefined
  wallet: string | undefined
  walletBalance: string | undefined
}

export const ClawbackAssetTemplate: React.FC<IClawbackAssetTemplate> = ({
  onSubmit,
  setWallet,
  wallet,
  loading,
  asset,
  vaults,
  assetData,
  walletBalance,
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    getValues,
    clearErrors,
    setError,
  } = useForm()

  const [typeAccount, setTypeAccount] = React.useState<'INTERNAL' | 'EXTERNAL'>(
    'INTERNAL'
  )

  const handleForm = (data: FieldValues): void => {
    clearErrors()
    let hasError = false
    if (!data.amount) {
      setError('amount', { message: 'This field is required' })
      hasError = true
    }
    if (typeAccount === 'INTERNAL' && !wallet) {
      setError('wallet', { message: 'This field is required' })
      hasError = true
    }

    if (typeAccount === 'EXTERNAL' && !data.from) {
      setError('from', { message: 'This field is required' })
      hasError = true
    }
    if (!hasError) {
      onSubmit(data, setValue, wallet)
    }
  }

  return (
    <Flex flexDir="column" w="full">
      <Container variant="primary" justifyContent="center" p="0" maxW="full">
        <AssetHeader asset={asset} />
        <RadioGroup
          onChange={(value: 'INTERNAL' | 'EXTERNAL'): void => {
            setTypeAccount(value)
          }}
          value={typeAccount}
          ps="1rem"
          pt="1rem"
        >
          <Stack direction="row">
            <Radio value="INTERNAL">Internal account</Radio>
            <Radio value="EXTERNAL">External account</Radio>
          </Stack>
        </RadioGroup>
        <Box p="1rem">
          <form onSubmit={handleSubmit(data => handleForm(data))}>
            {typeAccount === 'INTERNAL' ? (
              <FormControl isInvalid={errors?.wallet !== undefined}>
                <FormLabel>Vault</FormLabel>
                <SelectVault
                  vaults={vaults}
                  setWallet={setWallet}
                  clearErrors={(): void => {
                    clearErrors('wallet')
                  }}
                  noOptionsMessage="No vaults or wallets with funds"
                />

                {walletBalance && (
                  <SupplyTag
                    value={`${
                      typeAccount === 'INTERNAL' ? 'Vault' : 'Wallet'
                    } balance: ${
                      assetData
                        ? `${toCrypto(Number(walletBalance))} ${asset.code}`
                        : 'loading'
                    }`}
                  />
                )}
                <FormErrorMessage>
                  {errors?.wallet?.message?.toString()}
                </FormErrorMessage>
              </FormControl>
            ) : (
              <FormControl isInvalid={errors?.from !== undefined}>
                <FormLabel>Wallet</FormLabel>
                <Input
                  type="text"
                  placeholder="Wallet"
                  {...register('from', {
                    required: true,
                  })}
                />
                <FormErrorMessage>
                  {errors?.from?.message?.toString()}
                </FormErrorMessage>
              </FormControl>
            )}

            <FormControl isInvalid={errors?.amount !== undefined} mt="1.5rem">
              <FormLabel>Amount</FormLabel>
              <Input
                as={NumericFormat}
                decimalScale={7}
                thousandSeparator=","
                placeholder="Amount"
                autoComplete="off"
                value={getValues('amount')}
                onChange={(event): void => {
                  if (
                    Number(toNumber(event.currentTarget.value)) >
                    Number(walletBalance)
                  ) {
                    setError('amount', {
                      message: `Amount exceeded`,
                    })
                  } else {
                    clearErrors('amount')
                  }
                  setValue('amount', toNumber(event.target.value))
                }}
              />
              <FormErrorMessage>
                {errors?.amount?.message?.toString()}
              </FormErrorMessage>
            </FormControl>
            <SupplyTag
              value={`Circulation supply: ${
                assetData
                  ? `${toCrypto(Number(assetData.amount))} ${asset.code}`
                  : 'loading'
              }`}
            />
            <Flex alignItems="flex-end" flexDir="column" mt="1.5rem" gap={3}>
              <Button
                type="submit"
                variant="primary"
                isDisabled={
                  !asset.clawback_enabled || errors.amount != undefined
                }
                isLoading={loading}
                w={{ base: 'full', md: 'fit-content' }}
              >
                Clawback
              </Button>
              {!asset.clawback_enabled && (
                <InfoTag text="Balance clawback is not possible; clawback control is not enabled." />
              )}
            </Flex>
          </form>
        </Box>
      </Container>
    </Flex>
  )
}
