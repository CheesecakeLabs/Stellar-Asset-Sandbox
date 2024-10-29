import {
  Container,
  Flex,
  FocusLock,
  FormControl,
  FormLabel,
  Img,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  Switch,
  Tag,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import React, { Dispatch, SetStateAction } from 'react'
import { ChevronDown, Copy, Repeat } from 'react-feather'

import { toCrypto } from 'utils/formatter'

import { XLMIcon } from 'components/icons'

import USA_FLAG from 'app/core/resources/usa-flag.png'

interface IOpexCard {
  accountData: Hooks.UseHorizonTypes.IAccount | undefined
  transactions: Hooks.UseHorizonTypes.ITransactionItem[] | undefined
  mostRepeatedType: string | undefined
  USDPrice: Hooks.UseAssetsTypes.IPriceConversion | undefined
  transactionsQuantity: number
  setIncludeSoroban: Dispatch<SetStateAction<boolean>>
}

export const OpexCard: React.FC<IOpexCard> = ({
  accountData,
  transactions,
  USDPrice,
  transactionsQuantity,
  setIncludeSoroban,
}) => {
  const { onOpen, onClose, isOpen } = useDisclosure()

  const convertToUSD = (value: number): string => {
    return toCrypto(value * (USDPrice?.USD || 1), undefined, true)
  }

  const getFeeCharged = (): number | undefined => {
    return transactions?.reduce(
      (total, transaction) => total + Number(transaction.fee_charged),
      0
    )
  }

  return (
    <>
      {!accountData ? (
        <div></div>
      ) : (
        <Container variant="primary" mb="1rem" p={4} w="full" maxW="full">
          <Flex justifyContent="space-between" w="full">
            <Text fontSize="md">Sandbox Expenses account</Text>
            <Popover
              trigger={'hover'}
              isOpen={isOpen}
              closeOnBlur={false}
              onOpen={onOpen}
              onClose={onClose}
            >
              <PopoverTrigger>
                <Flex cursor="pointer">
                  <Text fontSize="sm" fontWeight="700">
                    Operating Expenses Account
                  </Text>
                  <ChevronDown />
                </Flex>
              </PopoverTrigger>
              <PopoverContent p={5} _dark={{ bg: 'black.700' }}>
                <FocusLock persistentFocus={false}>
                  <PopoverArrow />
                  <Text
                    fontSize="xs"
                    fontWeight="700"
                    color="text.secondary"
                    bg="gray.50"
                    p="0.75rem"
                    borderRadius={8}
                  >
                    {accountData.account_id}
                  </Text>
                  <Flex
                    gap={2}
                    cursor="pointer"
                    justifyContent="flex-end"
                    alignItems="center"
                    mt="0.5rem"
                    onClick={(): void => {
                      navigator.clipboard.writeText(accountData.account_id)
                    }}
                  >
                    <Text fontSize="xs" fontWeight="bold" color="gray">
                      Copy
                    </Text>
                    <Copy color="gray" size="12px" />
                  </Flex>
                </FocusLock>
              </PopoverContent>
            </Popover>
          </Flex>
          <Text fontSize="sm" mt="2rem">
            {`Cost of the last ${transactionsQuantity} transactions`}
          </Text>

          <Flex
            alignItems="center"
            w="full"
            justifyContent="center"
            gap={6}
            pt={8}
            pb={4}
          >
            <Tag variant="value" gap={3}>
              <XLMIcon />
              {`${toCrypto(getFeeCharged() || 0, undefined, true)} XLM`}
            </Tag>
            <Repeat color="gray" />
            <Tag variant="value" gap={3}>
              <Img src={USA_FLAG} w="1.5rem" />
              {`$${convertToUSD(getFeeCharged() || 0)}`}
            </Tag>
          </Flex>

          <Flex alignItems="center" w="full" mt="1rem">
            <FormControl display="flex" justifyContent="center">
              <Switch
                id="sorobanTransactions"
                onChange={(event): void => {
                  setIncludeSoroban(event.target.checked)
                }}
              />
              <FormLabel
                htmlFor="sorobanTransactions"
                fontSize="sm"
                fontWeight="bold"
                ms={2}
                cursor="pointer"
              >
                Include Soroban Transactions
              </FormLabel>
            </FormControl>
          </Flex>
        </Container>
      )}
    </>
  )
}
