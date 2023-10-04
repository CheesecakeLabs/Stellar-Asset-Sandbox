import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Img,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { FieldValues, UseFormSetValue, useForm } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'

import { havePermission } from 'utils'
import { getCurrencyIcon } from 'utils/constants/constants'
import { toCrypto, toNumber } from 'utils/formatter'

import { Permissions } from 'components/enums/permissions'
import { LockIcon } from 'components/icons'
import { SelectVault } from 'components/molecules/select-vault'
import { base64ToImg } from 'utils/converter'

interface IDistributeVault {
  onSubmit(
    amount: string,
    setValue: UseFormSetValue<FieldValues>,
    wallet: string | undefined
  ): Promise<void>
  loading: boolean
  vaults: Hooks.UseVaultsTypes.IVault[] | undefined
  vault: Hooks.UseVaultsTypes.IVault | undefined
  selectedAsset: Hooks.UseAssetsTypes.IAssetDto | undefined
  userPermissions: Hooks.UseAuthTypes.IUserPermission[] | undefined
}

export const DistributeVault: React.FC<IDistributeVault> = ({
  onSubmit,
  loading,
  vaults,
  vault,
  selectedAsset,
  userPermissions,
}) => {
  const {
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm()

  const [amount, setAmount] = useState<string | undefined>()
  const [wallet, setWallet] = useState<string | undefined>()
  const [externalWallet, setExternalWallet] = useState<string | undefined>()
  const [typeAccount, setTypeAccount] = React.useState<'INTERNAL' | 'EXTERNAL'>(
    'INTERNAL'
  )

  const getBalance = (): string => {
    return (
      vault?.accountData?.balances.find(
        balance =>
          balance.asset_code === selectedAsset?.code &&
          balance.asset_issuer === selectedAsset.issuer.key.publicKey
      )?.balance || ''
    )
  }

  const isAuthorized = (): boolean => {
    return (
      vault?.accountData?.balances.find(
        balance =>
          balance.asset_code === selectedAsset?.code &&
          balance.asset_issuer === selectedAsset.issuer.key.publicKey
      )?.is_authorized || false
    )
  }

  const distribute = (): void => {
    if (!amount) return
    const address = typeAccount === 'INTERNAL' ? wallet : externalWallet
    onSubmit(amount, setValue, address)
  }

  const isDisabledButton = (): boolean => {
    if (typeAccount === 'INTERNAL') {
      return !wallet || !amount
    }
    return !externalWallet || !amount
  }

  return (
    <Flex flexDir="column" w="full">
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
            Transfer
          </Text>
        </Flex>
        <Box p="1rem">
          {selectedAsset ? (
            <>
              <form
                onSubmit={handleSubmit(() => {
                  distribute()
                })}
              >
                <Flex
                  fill="black"
                  stroke="black"
                  _dark={{ fill: 'white', stroke: 'white' }}
                >
                  {selectedAsset.image ? (
                    <Img src={base64ToImg(selectedAsset.image)} w="32px" h="32px" />
                  ) : (
                    getCurrencyIcon(selectedAsset.code, '2rem')
                  )}
                  <Flex flexDir="column" ms="1rem">
                    <Text fontSize="sm">{selectedAsset.code}</Text>
                    <Text fontSize="xs">{toCrypto(Number(getBalance()))}</Text>
                  </Flex>
                </Flex>

                {isAuthorized() ? (
                  <>
                    <Tabs
                      variant="simpleRounded"
                      mt="1rem"
                      onChange={(index): void =>
                        setTypeAccount(index === 0 ? 'INTERNAL' : 'EXTERNAL')
                      }
                    >
                      <TabList>
                        {havePermission(
                          Permissions.MOVE_BALANCES_VAULTS,
                          userPermissions
                        ) && <Tab>Internal account</Tab>}
                        {havePermission(
                          Permissions.MOVE_BALANCES_EXTERNAL_ACCOUNTS,
                          userPermissions
                        ) && <Tab>External account</Tab>}
                      </TabList>
                      <TabPanels>
                        <TabPanel>
                          <FormControl mt="1.5rem">
                            <FormLabel>Destination Vault</FormLabel>
                            <SelectVault
                              vaults={vaults}
                              setWallet={setWallet}
                              distributorWallet={
                                selectedAsset.distributor.key.publicKey
                              }
                            />
                          </FormControl>
                        </TabPanel>
                        <TabPanel>
                          <FormControl
                            isInvalid={errors?.amount !== undefined}
                            mt="1.5rem"
                          >
                            <FormLabel>External address</FormLabel>
                            <Input
                              isDisabled={!isAuthorized()}
                              placeholder="External address"
                              autoComplete="off"
                              onChange={(event): void => {
                                setExternalWallet(event.target.value)
                              }}
                            />
                          </FormControl>
                        </TabPanel>
                      </TabPanels>

                      <FormControl
                        isInvalid={errors?.amount !== undefined}
                        mt="1.5rem"
                      >
                        <FormLabel>Amount</FormLabel>
                        <Input
                          as={NumericFormat}
                          decimalScale={7}
                          thousandSeparator=","
                          isDisabled={!isAuthorized()}
                          placeholder="Amount"
                          autoComplete="off"
                          onChange={(event): void => {
                            setAmount(toNumber(event.target.value))
                          }}
                        />
                        <FormErrorMessage>Required</FormErrorMessage>
                      </FormControl>

                      <Flex justifyContent="flex-end">
                        <Button
                          isDisabled={isDisabledButton()}
                          type="submit"
                          variant="primary"
                          mt="1.5rem"
                          isLoading={loading}
                        >
                          Distribute asset
                        </Button>
                      </Flex>
                    </Tabs>
                  </>
                ) : (
                  <VStack py="2rem">
                    <LockIcon />
                    <Text textAlign="center" maxW="360px">
                      This account is not authorized to hold this asset. Please
                      contact the asset manager.
                    </Text>
                  </VStack>
                )}
              </form>
            </>
          ) : (
            <VStack minH="4rem" justifyContent="center">
              <Text fontSize="sm" fontWeight="700">
                Select the asset
              </Text>
            </VStack>
          )}
        </Box>
      </Container>
    </Flex>
  )
}
