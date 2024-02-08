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
import { InfoTag } from 'components/atoms/info-tag'
import { SelectVault } from 'components/molecules/select-vault'
import { VaultsStatusList } from 'components/molecules/vaults-status-list'

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
  vaultsStatusList: Hooks.UseVaultsTypes.IVaultAccountName[] | undefined
}

export const FreezeAccountTemplate: React.FC<IFreezeAccountTemplate> = ({
  onSubmit,
  loading,
  asset,
  vaults,
  vaultsStatusList,
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    clearErrors,
    setError,
  } = useForm()

  const [loadingFreeze, setLoadingFreeze] = useState(false)
  const [loadingUnfreeze, setLoadingUnfreeze] = useState(false)

  const [wallet, setWallet] = useState<string | undefined>()
  const [typeAccount, setTypeAccount] = React.useState<'INTERNAL' | 'EXTERNAL'>(
    'INTERNAL'
  )

  const freeze = (data: FieldValues): void => {
    if (typeAccount === 'INTERNAL' && !wallet) {
      setError('wallet', { message: 'This field is required' })
      return
    }

    if (typeAccount === 'EXTERNAL' && !data.trustor_pk) {
      setError('trustor_pk', { message: 'This field is required' })
      return
    }

    setLoadingUnfreeze(false)
    setLoadingFreeze(true)
    onSubmit(data, ['TRUST_LINE_AUTHORIZED'], [], setValue, wallet)
  }

  const unfreeze = (data: FieldValues): void => {
    if (typeAccount === 'INTERNAL' && !wallet) {
      setError('wallet', { message: 'This field is required' })
      return
    }

    if (typeAccount === 'EXTERNAL' && !data.trustor_pk) {
      setError('trustor_pk', { message: 'This field is required' })
      return
    }

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
              <FormLabel>Vault or wallet</FormLabel>
              <SelectVault
                vaults={vaults}
                setWallet={setWallet}
                clearErrors={(): void => {
                  clearErrors('wallet')
                }}
                noOptionsMessage="No authorized vaults or wallets"
              />
              <FormErrorMessage>
                {errors?.wallet?.message?.toString()}
              </FormErrorMessage>
            </FormControl>
          ) : (
            <FormControl isInvalid={errors?.trustor_pk !== undefined}>
              <FormLabel>Wallet</FormLabel>
              <Input
                type="text"
                placeholder="Wallet"
                {...register('wallet', {
                  required: true,
                })}
              />
              <FormErrorMessage>
                {errors?.trustor_pk?.message?.toString()}
              </FormErrorMessage>
            </FormControl>
          )}
          <Flex alignItems="flex-end" flexDir="column" mt="1.5rem" gap={3}>
            <Flex gap={4}>
              <Button
                type="submit"
                variant="primary"
                isDisabled={!asset.freeze_enabled}
                isLoading={loading && loadingFreeze}
                w={{ base: 'full', md: 'fit-content' }}
                onClick={handleSubmit(data => {
                  freeze(data)
                })}
              >
                Freeze
              </Button>
              <Button
                type="submit"
                variant="secondary"
                isDisabled={!asset.freeze_enabled}
                isLoading={loading && loadingUnfreeze}
                w={{ base: 'full', md: 'fit-content' }}
                onClick={handleSubmit(data => {
                  unfreeze(data)
                })}
              >
                Unfreeze
              </Button>
            </Flex>
            {!asset.freeze_enabled && (
              <InfoTag text="You cannot freeze accounts for this asset; freeze control is not enabled." />
            )}
          </Flex>
        </Box>
      </Container>

      <VaultsStatusList
        vaultsStatus={vaultsStatusList}
        asset={asset}
        authorizedLabel={'Authorized'}
        unauthorizedLabel={'Frozen'}
      />
    </Flex>
  )
}
