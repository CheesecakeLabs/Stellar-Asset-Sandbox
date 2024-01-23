import {
  Box,
  Button,
  Checkbox,
  Container,
  Flex,
  Progress,
  Tag,
  Text,
} from '@chakra-ui/react'
import React, { ReactNode, useState } from 'react'
import Countdown from 'react-countdown'
import { useForm } from 'react-hook-form'

import { toCrypto } from 'utils/formatter'

interface IWithdraw {
  onSubmit(isPremature: boolean): Promise<void>
  contract: Hooks.UseContractsTypes.IContract | undefined
  loading: boolean
  isDone: boolean
  withdrawValue: number
  contractData: Hooks.UseContractsTypes.IContractData
  deposited: number | undefined
  currentInVault: string | undefined
  timerCounter: number | undefined
}

export const Withdraw: React.FC<IWithdraw> = ({
  onSubmit,
  loading,
  contract,
  isDone,
  withdrawValue,
  contractData,
  deposited,
  currentInVault,
  timerCounter
}) => {
  const { handleSubmit } = useForm()
  const [isPremature, setIsPremature] = useState(false)

  interface ICountdown {
    days: number
    hours: number
    minutes: number
    seconds: number
    completed: boolean
  }

  const insuficientBalance = (): boolean => {
    if (!isDone) {
      return (
        contractData.estimatedPrematureWithdraw / 10000000 >
        Number(currentInVault)
      )
    }
    return contractData.position > Number(currentInVault)
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

  const calculatePercentage = (): number => {
    if (!contract?.term) return 0
    const result = (contractData.timeLeft || 0) / contract.term
    return 100 - result * 100
  }

  return (
    <Flex flexDir="column" w={{ base: 'full', md: '640px' }}>
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
            Withdraw
          </Text>
        </Flex>
        <Box p="1rem">
          <Container
            w="full"
            display="flex"
            justifyContent="center"
            flexDir="column"
            bg="gray.50"
            mb="1.5rem"
            py="1rem"
            borderRadius="0.5rem"
            _dark={{ bg: 'black.800' }}
          >
            <Text fontSize="2xl" textAlign="center">
              {`${toCrypto(Number(contractData.position))} ${
                contract?.asset.code
              }`}
            </Text>
            <Container w="full" display="flex" justifyContent="center">
              <Text
                fontSize="xs"
                bg="#e0eaf9"
                py="0.35rem"
                px="0.75rem"
                mt="0.25rem"
                borderRadius="0.5rem"
                color="purple.600"
                _dark={{ bg: 'black.700', color: 'white' }}
              >
                {`+${toCrypto(contractData.yield)} ${contract?.asset.code} (${(
                  (Number(contractData.yield) / Number(deposited)) *
                  100
                ).toFixed(2)}%)`}
              </Text>
            </Container>
          </Container>
          {!isDone && (
            <>
              <Text fontSize="xs">
                The full amount will be available to be withdrawn at the end of
                the term. By withdrawing earlier, a penalty rate will be applied
                to the accrued interest, reducing your gains.
              </Text>

              <Text
                my="1rem"
                py="0.5rem"
                bg="gray.600"
                textAlign="center"
                fontSize="xs"
                fontWeight="600"
                px="1rem"
                _dark={{ bg: 'black.800', color: 'white' }}
              >
                {`Your position hasn't reached its term. By withdrawing now you'll
            only get ${
              100 - (contract?.penalty_rate || 0) / 100
            }% of the yield accrued to date.`}
              </Text>
            </>
          )}
          <form
            onSubmit={handleSubmit(() => {
              onSubmit(isPremature)
            })}
          >
            {
              <Flex
                justifyContent="space-between"
                alignItems="center"
                mt="2rem"
                w="full"
              >
                <Flex w="full">
                  {!isDone && (
                    <Checkbox
                      me="1rem"
                      onChange={(event): void => {
                        setIsPremature(event.target.checked)
                      }}
                      border="1px solid"
                      borderColor="gray.100"
                      w="full"
                      padding="0.5rem"
                    >
                      <Box>
                        <Text>I would like to anticipate the withdrawal</Text>
                        <Text
                          bg="gray.100"
                          borderRadius="full"
                          fontSize="xs"
                          fontWeight="bold"
                          px="0.5rem"
                          py="0.25rem"
                          w="fit-content"
                          _dark={{ bg: 'black.800', color: 'white' }}
                        >{`You will receive ${toCrypto(withdrawValue)} ${
                          contract?.asset.code
                        }`}</Text>
                      </Box>
                    </Checkbox>
                  )}
                </Flex>
              </Flex>
            }

            {insuficientBalance() && (
              <Tag variant="red" w="full" mt="1rem" justifyContent="center">
                The vault does not currently have sufficient balance.
              </Tag>
            )}

            <Button
              w="full"
              borderRadius="1.5rem"
              type="submit"
              variant="primary"
              isLoading={loading}
              isDisabled={(!isDone && !isPremature) || insuficientBalance()}
              px="1.25rem"
              mt="1rem"
            >
              <Text color="white" fontSize="sm" w="full" textAlign="center">
                {isDone ? 'Withdraw' : 'Withdraw with penalty'}
              </Text>
            </Button>
          </form>

          {!isDone && (
            <Flex
              flexDir="column"
              w="full"
              justifyContent="center"
              alignItems="center"
              mt="3rem"
            >
              <Countdown
                date={timerCounter}
                renderer={renderer}
              />
              <Progress
                value={calculatePercentage()}
                h="0.5rem"
                w="full"
                borderRadius="0.5rem"
                mt="0.25rem"
              />
            </Flex>
          )}
        </Box>
      </Container>
    </Flex>
  )
}
