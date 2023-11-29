import { Box, Button, Checkbox, Container, Flex, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ArrowDownCircle } from 'react-feather'
import { useForm } from 'react-hook-form'

import { toCrypto } from 'utils/formatter'

interface IWithdraw {
  onSubmit(isPremature: boolean): Promise<void>
  contract: Hooks.UseContractsTypes.IContract | undefined
  loading: boolean
  isDone: boolean
  withdrawValue: number
  contractData: Hooks.UseContractsTypes.IContractData
}

export const Withdraw: React.FC<IWithdraw> = ({
  onSubmit,
  loading,
  contract,
  isDone,
  withdrawValue,
  contractData,
}) => {
  const { handleSubmit } = useForm()
  const [isPremature, setIsPremature] = useState(false)

  return (
    <Flex flexDir="column" w="420px">
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
          >
            <Text fontSize="3xl" textAlign="center">
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
                color="#2c4afd"
              >
                {`+${toCrypto(contractData.yield)} ${contract?.asset.code} (${(
                  (Number(contractData.yield) /
                    Number(contractData.deposited)) *
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
              >
                {`Your position hasn't reached its term. By withdrawing now you'll
            only get ${
              (contract?.penalty_rate || 0) / 100
            }% of the yield accrued to date.`}
              </Text>
            </>
          )}
          <form
            onSubmit={handleSubmit(() => {
              onSubmit(isPremature)
            })}
          >
            {/*<Flex justifyContent="space-between" alignItems="center" mt="2rem">
              <Flex justifyContent="flex-end">
                {!isDone && (
                  <Checkbox
                    fontSize="xs"
                    me="1rem"
                    onChange={(event): void => {
                      setIsPremature(event.target.checked)
                    }}
                  >
                    I would like to anticipate the withdrawal
                  </Checkbox>
                )}
              </Flex>
            </Flex>*/}
            <Button
              w="full"
              borderRadius="1.5rem"
              type="submit"
              variant="primary"
              isLoading={loading}
              px="1.25rem"
            >
              <Flex justifyContent="space-between" w="full">
                <Flex alignItems="center" gap="0.5rem">
                  <ArrowDownCircle size="1rem" />
                  <Text color="white" fontSize="sm">
                    {isDone ? 'Withdraw' : 'Withdraw premature'}
                  </Text>
                </Flex>
                <Text color="white">{`${toCrypto(withdrawValue)} ${
                  contract?.asset.code
                }`}</Text>
              </Flex>
            </Button>
          </form>
        </Box>
      </Container>
    </Flex>
  )
}
