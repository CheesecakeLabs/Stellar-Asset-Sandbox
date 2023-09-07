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
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { FieldValues, UseFormSetValue, useForm } from 'react-hook-form'

import { AssetHeader } from 'components/atoms'

import { AccountsChart } from '../../molecules/accounts-chart'
import { SelectVault } from '../../molecules/select-vault'

interface IAuthorizeAccountTemplate {
  onSubmit(
    data: FieldValues,
    setValue: UseFormSetValue<FieldValues>,
    wallet: string | undefined
  ): Promise<void>
  loading: boolean
  asset: Hooks.UseAssetsTypes.IAssetDto
  vaultsAuthorized: Hooks.UseVaultsTypes.IVault[] | undefined
  vaultsUnauthorized: Hooks.UseVaultsTypes.IVault[] | undefined
}

export const AuthorizeAccountTemplate: React.FC<IAuthorizeAccountTemplate> = ({
  onSubmit,
  loading,
  asset,
  vaultsUnauthorized,
  vaultsAuthorized,
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

      <Container
        variant="primary"
        maxW="full"
        mt="1rem"
        py="0.5rem"
        px="0.75rem"
      >
        <Text fontSize="xs" fontWeight="600" mb="1rem">
          Vaults
        </Text>
        <Flex w="full" maxW="full">
          <Box w="280px" mr="1rem">
            <AccountsChart
              authorized={asset.assetData?.accounts.authorized || 0}
              unauthorized={
                (asset.assetData?.accounts.authorized_to_maintain_liabilities ||
                  0) + (asset.assetData?.accounts.unauthorized || 0)
              }
            />
          </Box>
          <Flex w="full" gap={4}>
            <Table variant="list">
              <Thead>
                <Th>Authorized vaults</Th>
              </Thead>
              <Tbody>
                {vaultsAuthorized?.map(vault => (
                  <Tr>
                    <Td>{vault.name}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Table variant="list" h="min-content">
              <Thead>
                <Th>Unauthorized vaults</Th>
              </Thead>
              <Tbody>
                {vaultsUnauthorized?.map(vault => (
                  <Tr>
                    <Td>{vault.name}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Flex>
        </Flex>
      </Container>
    </Flex>
  )
}
