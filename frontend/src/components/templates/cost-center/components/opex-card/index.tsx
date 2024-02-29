import {
  Container,
  Flex,
  FocusLock,
  Img,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  Tag,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import React from 'react'
import { ChevronDown, Copy, Repeat } from 'react-feather'
import USA_FLAG from 'app/core/resources/usa-flag.png'

import { SPONSORED_RESERVES_LINK } from 'utils/constants/constants'
import { toCrypto } from 'utils/formatter'

import { LinkIcon, XLMIcon } from 'components/icons'

interface IOpexCard {
  accountData: Hooks.UseHorizonTypes.IAccount | undefined
  latestFeeCharged: number | undefined
  mostRepeatedType: string | undefined
  USDPrice: Hooks.UseAssetsTypes.IPriceConversion | undefined
}

export const OpexCard: React.FC<IOpexCard> = ({
  accountData,
  latestFeeCharged,
  mostRepeatedType,
  USDPrice,
}) => {
  const { onOpen, onClose, isOpen } = useDisclosure()

  const convertToUSD = (value: number): string => {
    return toCrypto(value * (USDPrice?.USD || 1), undefined, true)
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
            Cost of the last 10 transactions
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
              {`${toCrypto(latestFeeCharged || 0, undefined, true)} XLM`}
            </Tag>
            <Repeat color="gray" />
            <Tag variant="value" gap={3}>
              <Img src={USA_FLAG} w="1.5rem"/>
              {`$${convertToUSD(latestFeeCharged || 0)}`}
            </Tag>
          </Flex>

          <Flex
            alignItems="center"
            w="full"
            justifyContent="space-between"
            mt="1rem"
            flexDir={{ base: 'column', md: 'row' }}
          >
            <Flex flexDir="column" alignItems="center">
              <Text
                fontSize="sm"
                mt="1rem"
                cursor="pointer"
                onClick={(): Window | null =>
                  window.open(`${SPONSORED_RESERVES_LINK}`, '_blank')
                }
                flexDir="row"
                display="flex"
                alignItems="center"
                gap={1}
              >
                Total sponsored reserves <LinkIcon />
              </Text>
              <Text fontSize="sm" mt="0.25rem" fontWeight="700">
                {accountData.num_sponsoring}
              </Text>
            </Flex>
            <Flex flexDir="column" alignItems="center">
              <Text fontSize="sm" mt="1rem">
                Average Fee Charged
              </Text>
              <Text fontSize="xs">(based on the last 10 transactions)</Text>
              <Text fontSize="sm" mt="0.25rem" fontWeight="700">
                {`${toCrypto(
                  (latestFeeCharged || 0) / 10,
                  undefined,
                  true
                )} XLM`}
              </Text>
            </Flex>
            <Flex flexDir="column" alignItems="center">
              <Text fontSize="sm" mt="1rem">
                Main type of transaction
              </Text>
              <Text fontSize="xs">(based on the last 10 transactions)</Text>
              <Text fontSize="sm" mt="0.25rem" fontWeight="700">
                {mostRepeatedType || '-'}
              </Text>
            </Flex>
          </Flex>
        </Container>
      )}
    </>
  )
}
