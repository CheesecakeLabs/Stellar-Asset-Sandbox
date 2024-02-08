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
import React, { Dispatch, SetStateAction, useState } from 'react'
import { FieldValues, UseFormSetValue, useForm } from 'react-hook-form'

import { AssetHeader } from 'components/atoms'
import { InfoTag } from 'components/atoms/info-tag'
import { VaultsStatusList } from 'components/molecules/vaults-status-list'

import { SelectVault } from '../../molecules/select-vault'

interface IAuthorizeAccountTemplate {
  onSubmit(
    data: FieldValues,
    setValue: UseFormSetValue<FieldValues>,
    wallet: string | undefined,
    setWallet: Dispatch<SetStateAction<string | undefined>>
  ): Promise<void>
  loading: boolean
  asset: Hooks.UseAssetsTypes.IAssetDto
  vaultsUnauthorized: Hooks.UseVaultsTypes.IVault[] | undefined
  vaultsStatusList: Hooks.UseVaultsTypes.IVaultAccountName[] | undefined
}

export const AuthorizeAccountTemplate: React.FC<IAuthorizeAccountTemplate> = ({
  onSubmit,
  loading,
  asset,
  vaultsUnauthorized,
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

  const [wallet, setWallet] = useState<string | undefined>()
  const [typeAccount, setTypeAccount] = React.useState<'INTERNAL' | 'EXTERNAL'>(
    'INTERNAL'
  )

  const handleForm = (data: FieldValues): void => {
    if (
      (typeAccount === 'INTERNAL' && !wallet) ||
      (typeAccount === 'EXTERNAL' && !data.wallet)
    ) {
      setError('wallet', { message: 'This field is required' })
      return
    }
    onSubmit(data, setValue, wallet, setWallet)
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
                <FormLabel>Vault or wallet</FormLabel>
                <SelectVault
                  vaults={vaultsUnauthorized}
                  setWallet={setWallet}
                  clearErrors={(): void => {
                    clearErrors('wallet')
                  }}
                  noOptionsMessage="No vaults or wallets with pending authorization"
                />
                <FormErrorMessage>
                  {errors?.wallet?.message?.toString()}
                </FormErrorMessage>
              </FormControl>
            ) : (
              <FormControl isInvalid={errors?.wallet !== undefined}>
                <FormLabel>Wallet</FormLabel>
                <Input
                  type="text"
                  placeholder="Wallet"
                  {...register('wallet', {
                    required: true,
                  })}
                />
                <FormErrorMessage>
                  {errors?.wallet?.message?.toString()}
                </FormErrorMessage>
              </FormControl>
            )}
            <Flex alignItems="flex-end" flexDir="column" mt="1.5rem" gap={3}>
              <Button
                type="submit"
                variant="primary"
                isDisabled={!asset.authorize_required}
                isLoading={loading}
                w={{ base: 'full', md: 'fit-content' }}
              >
                Authorize
              </Button>
              {!asset.authorize_required && (
                <InfoTag text="Authorization is not required, all accounts can hold balance and transact this asset." />
              )}
            </Flex>
          </form>
        </Box>
      </Container>
      <VaultsStatusList
        vaultsStatus={vaultsStatusList}
        asset={asset}
        authorizedLabel={'Authorized'}
        unauthorizedLabel={'Pending authorization'}
      />
    </Flex>
  )
}
