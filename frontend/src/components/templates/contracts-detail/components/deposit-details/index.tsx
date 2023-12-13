import { Flex, Text } from '@chakra-ui/react'
import React, { ReactNode } from 'react'
import Countdown from 'react-countdown'

import { toCrypto } from 'utils/formatter'

import { ContractHistory } from '../contract-history'

interface IDepositDetails {
  contract: Hooks.UseContractsTypes.IContract
  contractData: Hooks.UseContractsTypes.IContractData | undefined
  currentBalance: string
  deposited: number | undefined
  history: Hooks.UseContractsTypes.IHistory[] | undefined
}

export const DepositDetails: React.FC<IDepositDetails> = ({
  contract,
  contractData,
  currentBalance,
  history,
  deposited,
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
    if (contract.compound === 0) {
      return 'Every second'
    }
    if (completed) {
      return '-'
    } else if (days === 0 && hours === 0) {
      return <Text>{`${minutes}min ${seconds}s`}</Text>
    } else if (days === 0) {
      return <Text>{`${hours}h ${minutes}min`}</Text>
    }
    return <Text>{`${days} days ${hours}h ${minutes}min`}</Text>
  }

  const calculateNextYield = (): number => {
    if (!contractData?.timeLeft) {
      return 0
    }
    const result = contractData.timeLeft % contract.compound
    return result == 0 ? contract.compound : result
  }

  return (
    <Flex flexDir="column" w="full">
      <Flex
        flexDir="column"
        w="full"
        maxW="full"
        gap="0.75rem"
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
                  Deposited
                </Text>
                <Text ms="0.5rem">{`${toCrypto(deposited)} ${
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
                  Accrued Yield
                </Text>
                <Text ms="0.5rem">{`${(contractData.yield / 100).toFixed(
                  2
                )}%`}</Text>
              </Flex>
            </Flex>

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
                  Current in your vault
                </Text>
                <Text ms="0.5rem">
                  {`${toCrypto(Number(currentBalance))} ${
                    contract?.asset.code
                  }`}
                </Text>
              </Flex>

              {contract.compound > 0 && (
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
                    Compounds in
                  </Text>
                  <Flex ms="0.5rem">
                    <Countdown
                      date={Date.now() + calculateNextYield() * 1000}
                      renderer={renderer}
                    />
                  </Flex>
                </Flex>
              )}
            </Flex>

            <ContractHistory contract={contract} history={history} />
          </Flex>
        )}
      </Flex>
    </Flex>
  )
}
