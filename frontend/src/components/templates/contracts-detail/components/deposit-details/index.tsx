import { Box, Flex, Img, Text } from '@chakra-ui/react'
import React, { ReactNode } from 'react'
import Countdown from 'react-countdown'
import { Calendar, AlertTriangle, DollarSign, Clock } from 'react-feather'

import { getCurrencyIcon } from 'utils/constants/constants'
import { base64ToImg } from 'utils/converter'
import { formatDateFull, toCrypto } from 'utils/formatter'

import { VaultIcon, ApyIcon, TimeIcon } from 'components/icons'
import { CompoundTime } from 'components/templates/contracts-create/components/select-compound'

import { ItemContractData } from '../item-contract-data'

interface IDepositDetails {
  contract: Hooks.UseContractsTypes.IContract
  contractData: Hooks.UseContractsTypes.IContractData | undefined
}

export const DepositDetails: React.FC<IDepositDetails> = ({
  contract,
  contractData,
}) => {
  interface ICountdown {
    days: number
    hours: number
    minutes: number
    seconds: number
    completed: boolean
  }

  const renderer = ({
    days,
    hours,
    minutes,
    seconds,
    completed,
  }: ICountdown): ReactNode => {
    if (completed) {
      return 'Done'
    } else {
      return (
        <span>{`${
          days > 0 ? `${days} days` : ''
        } ${hours}h ${minutes}min ${seconds}s`}</span>
      )
    }
  }

  return (
    <Flex
      flexDir="column"
      w="full"
      maxW="full"
      gap="0.75rem"
      mt="0.5rem"
      borderRadius="0.25rem"
      p="1rem"
    >
      {contractData && (
        <Flex w="full" flexDir="column">
          <Flex mb="1.5rem">
            <Flex flexDir="column" w="full">
              <Text
                bg="gray.100"
                borderRadius="full"
                fontWeight="bold"
                fontSize="xs"
                px="0.75rem"
                py="0.25rem"
                w="fit-content"
                mb="0.15rem"
              >
                Due in
              </Text>
              <Box ms="0.5rem">
                <Countdown
                  date={Date.now() + contractData.timeLeft * 1000}
                  renderer={renderer}
                />
              </Box>
            </Flex>

            <Flex flexDir="column" w="full">
              <Text
                bg="gray.100"
                borderRadius="full"
                fontWeight="bold"
                fontSize="xs"
                px="0.75rem"
                py="0.25rem"
                w="fit-content"
                mb="0.15rem"
              >
                Current yield
              </Text>
              <Text ms="0.5rem">{`${contractData.yield}%`}</Text>
            </Flex>
          </Flex>

          <Flex>
            <Flex flexDir="column" w="full">
              <Text
                bg="gray.100"
                borderRadius="full"
                fontWeight="bold"
                fontSize="xs"
                px="0.75rem"
                py="0.25rem"
                w="fit-content"
                mb="0.15rem"
              >
                Deposited
              </Text>
              <Text ms="0.5rem">{`${toCrypto(contractData.deposited)} ${
                contract.asset.code
              }`}</Text>
            </Flex>

            <Flex flexDir="column" w="full">
              <Text
                bg="gray.100"
                borderRadius="full"
                fontWeight="bold"
                fontSize="xs"
                px="0.75rem"
                py="0.25rem"
                w="fit-content"
                mb="0.15rem"
              >
                Estimated premature withdraw
              </Text>
              <Text ms="0.5rem">{`${toCrypto(
                contractData.estimatedPrematureWithdraw / 10000000
              )} ${contract.asset.code}`}</Text>
            </Flex>
          </Flex>
        </Flex>
      )}
    </Flex>
  )
}
