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
import React, { useState } from 'react'
import { FieldValues, UseFormSetValue, useForm } from 'react-hook-form'

import { AssetHeader } from 'components/atoms'
import { SelectVault } from 'components/molecules/select-vault'

interface IFreezeAccountTemplate {
  onSubmit(
    data: FieldValues,
    clearFlags: string[],
    setFlags: string[],
    setValue: UseFormSetValue<FieldValues>,
    wallet: string | undefined
  ): Promise<void>
  loading: boolean
  asset: Hooks.UseAssetsTypes.IAssetDto
  vaults: Hooks.UseVaultsTypes.IVault[] | undefined
}

export const FreezeAccountTemplate: React.FC<IFreezeAccountTemplate> = ({
  onSubmit,
  loading,
  asset,
  vaults,
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm()

  const [loadingFreeze, setLoadingFreeze] = useState(false)
  const [loadingUnfreeze, setLoadingUnfreeze] = useState(false)

  const [wallet, setWallet] = useState<string | undefined>()
  const [typeAccount, setTypeAccount] = React.useState<'INTERNAL' | 'EXTERNAL'>(
    'INTERNAL'
  )

  const freeze = (data: FieldValues): void => {
    setLoadingUnfreeze(false)
    setLoadingFreeze(true)
    onSubmit(data, ['TRUST_LINE_AUTHORIZED'], [], setValue, wallet)
  }

  const unfreeze = (data: FieldValues): void => {
    setLoadingFreeze(false)
    setLoadingUnfreeze(true)
    onSubmit(data, [], ['TRUST_LINE_AUTHORIZED'], setValue, wallet)
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
          {typeAccount === 'INTERNAL' ? (
            <FormControl isInvalid={errors?.wallet !== undefined}>
              <FormLabel>Vault</FormLabel>
              <SelectVault vaults={vaults} setWallet={setWallet} />
              <FormErrorMessage>Required</FormErrorMessage>
            </FormControl>
          ) : (
            <FormControl isInvalid={errors?.trustor_id !== undefined}>
              <FormLabel>Wallet</FormLabel>
              <Input
                type="text"
                placeholder="Wallet"
                {...register('trustor_pk', {
                  required: true,
                })}
              />
              <FormErrorMessage>Required</FormErrorMessage>
            </FormControl>
          )}
          <Flex gap={4} justifyContent="flex-end">
            <Button
              type="submit"
              variant="primary"
              mt="1.5rem"
              isLoading={loading && loadingFreeze}
              onClick={handleSubmit(data => {
                freeze(data)
              })}
            >
              Freeze
            </Button>
            <Button
              type="submit"
              variant="secondary"
              mt="1.5rem"
              isLoading={loading && loadingUnfreeze}
              onClick={handleSubmit(data => {
                unfreeze(data)
              })}
            >
              Unfreeze
            </Button>
          </Flex>
        </Box>
      </Container>
    </Flex>
  )
}
