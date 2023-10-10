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
import { VaultsStatusList } from 'components/molecules/vaults-status-list'

import { SelectVault } from '../../molecules/select-vault'

interface IAuthorizeAccountTemplate {
  onSubmit(
    data: FieldValues,
    setValue: UseFormSetValue<FieldValues>,
    wallet: string | undefined
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
                <SelectVault
                  vaults={vaultsUnauthorized}
                  setWallet={setWallet}
                />
                <FormErrorMessage>Required</FormErrorMessage>
              </FormControl>
            ) : (
              <FormControl>
                <FormLabel>Wallet</FormLabel>
                <Input
                  type="text"
                  placeholder="Wallet"
                  {...register('wallet', {
                    required: true,
                  })}
                />
                <FormErrorMessage>Required</FormErrorMessage>
              </FormControl>
            )}
            <Flex justifyContent="flex-end">
              <Button
                type="submit"
                variant="primary"
                mt="1.5rem"
                isLoading={loading}
              >
                Authorize
              </Button>
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
