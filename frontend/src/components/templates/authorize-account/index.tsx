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

import { AccountsChart } from '../../molecules/accounts-chart'
import { AssetHeader } from 'components/atoms'

import { SelectVault } from '../../molecules/select-vault'

interface IAuthorizeAccountTemplate {
  onSubmit(
    data: FieldValues,
    setValue: UseFormSetValue<FieldValues>,
    wallet: string | undefined
  ): Promise<void>
  loading: boolean
  asset: Hooks.UseAssetsTypes.IAssetDto
  vaults: Hooks.UseVaultsTypes.IVault[] | undefined
}

export const AuthorizeAccountTemplate: React.FC<IAuthorizeAccountTemplate> = ({
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

      <AccountsChart
        authorized={asset.assetData?.accounts.authorized || 0}
        unauthorized={
          (asset.assetData?.accounts.authorized_to_maintain_liabilities || 0) +
          (asset.assetData?.accounts.unauthorized || 0)
        }
      />
    </Flex>
  )
}
