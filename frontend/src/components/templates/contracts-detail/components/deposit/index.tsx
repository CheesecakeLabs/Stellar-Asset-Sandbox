import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  Text,
  Img,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { FieldValues, UseFormSetValue, useForm } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'

import { getCurrencyIcon } from 'utils/constants/constants'
import { base64ToImg } from 'utils/converter'
import { toCrypto, toNumber } from 'utils/formatter'

interface IDeposit {
  onSubmit(
    data: FieldValues,
    setValue: UseFormSetValue<FieldValues>
  ): Promise<void>
  contract: Hooks.UseContractsTypes.IContract | undefined
  loading: boolean
  currentBalance: string
}

export const Deposit: React.FC<IDeposit> = ({
  onSubmit,
  loading,
  contract,
  currentBalance,
}) => {
  const {
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm()

  const [amount, setAmount] = useState<string>()
  const [isLimitExceded, setLimitExceded] = useState(false)

  const limitExceded = (amount: string): void => {
    setLimitExceded(Number(toNumber(amount)) > Number(currentBalance))
  }

  return (
    <Flex flexDir="column" w="640px">
      <Container variant="primary" p="0" maxW="full">
        <Flex
          alignItems="center"
          justifyContent="space-between"
          borderBottom="1px solid"
          borderColor={'gray.600'}
          h="3.5rem"
          px="1rem"
          _dark={{ fill: 'white', stroke: 'white', borderColor: 'black.800' }}
        >
          <Text fontSize="sm" fontWeight="600">
            {`Deposit ${contract?.asset.code}`}
          </Text>
        </Flex>
        <Flex w="full" alignItems="center" flexDir="column" mt="1.5rem">
          <Text fontSize="xs">Current in my wallet</Text>
          <Flex
            bg="gray.100"
            borderRadius="full"
            mb="0.5rem"
            mt="0.25rem"
            w="fit-content"
            px="0.75rem"
            py="0.25rem"
            alignItems="center"
            gap="0.5rem"
            _dark={{ bg: 'black.800', color: 'white' }}
          >
            {contract?.asset?.image ? (
              <Img src={base64ToImg(contract.asset.image)} w="16px" h="16px" />
            ) : (
              getCurrencyIcon(contract?.asset.code || '', '1rem')
            )}
            {`${toCrypto(Number(currentBalance))} ${contract?.asset.code}`}
          </Flex>
        </Flex>
        <Box p="1rem">
          <form
            onSubmit={handleSubmit(data => {
              data.amount = amount
              onSubmit(data, setValue)
            })}
          >
            <FormControl isInvalid={errors?.amount !== undefined}>
              <Input
                as={NumericFormat}
                decimalScale={7}
                thousandSeparator=","
                placeholder="Amount to deposit..."
                autoComplete="off"
                onChange={(target): void => {
                  setAmount(toNumber(target.currentTarget.value))
                  limitExceded(target.currentTarget.value)
                }}
              />
              <FormErrorMessage>Required</FormErrorMessage>
            </FormControl>

            <Button
              w="full"
              borderRadius="1.5rem"
              type="submit"
              variant="primary"
              isLoading={loading}
              mt="1.5rem"
              isDisabled={Number(currentBalance) === 0 || isLimitExceded}
            >
              Deposit
            </Button>
          </form>
        </Box>
      </Container>
    </Flex>
  )
}
