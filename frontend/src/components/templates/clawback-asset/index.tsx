import { Box, Button, Container, Flex, FormControl, FormErrorMessage, FormLabel, Input, Radio, RadioGroup, Stack, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { FieldValues, UseFormSetValue, useForm } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';



import { toCrypto, toNumber } from 'utils/formatter';



import { AssetHeader } from 'components/atoms';
import { SelectVault } from 'components/molecules/select-vault';


interface IClawbackAssetTemplate {
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

export const ClawbackAssetTemplate: React.FC<IClawbackAssetTemplate> = ({
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
    getValues,
  } = useForm()

  const [wallet, setWallet] = useState<string | undefined>()
  const [typeAccount, setTypeAccount] = React.useState<'INTERNAL' | 'EXTERNAL'>(
    'INTERNAL'
  )

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
          <form
            onSubmit={handleSubmit(data => {
              onSubmit(data, setValue, wallet)
            })}
          >
            {typeAccount === 'INTERNAL' ? (
              <FormControl isInvalid={errors?.wallet !== undefined}>
                <FormLabel>Vault</FormLabel>
                <SelectVault vaults={vaults} setWallet={setWallet} />
                <FormErrorMessage>Required</FormErrorMessage>
              </FormControl>
            ) : (
              <FormControl
                isInvalid={errors?.destination_wallet_id !== undefined}
              >
                <FormLabel>Wallet</FormLabel>
                <Input
                  type="text"
                  placeholder="Wallet"
                  {...register('from', {
                    required: true,
                  })}
                />
                <FormErrorMessage>Required</FormErrorMessage>
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
                  setValue('amount', toNumber(event.target.value))
                }}
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
              {`Circulation supply: ${
                assetData
                  ? `${toCrypto(Number(assetData.amount))} ${asset.code}`
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
                Clawback
              </Button>
            </Flex>
          </form>
        </Box>
      </Container>
    </Flex>
  )
}