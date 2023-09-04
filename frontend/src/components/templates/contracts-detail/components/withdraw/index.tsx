import { Box, Button, Checkbox, Container, Flex, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

import { toCrypto } from 'utils/formatter'

interface IWithdraw {
  onSubmit(isPremature: boolean): Promise<void>
  contract: Hooks.UseContractsTypes.IContract | undefined
  loading: boolean
  isDone: boolean
  withdrawValue: number
}

export const Withdraw: React.FC<IWithdraw> = ({
  onSubmit,
  loading,
  contract,
  isDone,
  withdrawValue,
}) => {
  const { handleSubmit } = useForm()
  const [isPremature, setIsPremature] = useState(false)

  return (
    <Flex flexDir="column" w="full" mt="1rem">
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
            {`Certificate of Deposit ${contract?.asset.code}`}
          </Text>
        </Flex>
        <Box p="1rem">
          <Text fontSize="sm">
            Some explanation text, what it does and what will happen lorem ipsum
            dolor sit amet consecteur lorem ipsum dolor sit amet consec teur
            lorem ipsum dolor sit amet consecteur lorem ipsum dolor sit amet
            consecteur.
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
            only get ${contract?.penalty_rate}% of the yield accrued to date.`}
          </Text>
          <form
            onSubmit={handleSubmit(() => {
              onSubmit(isPremature)
            })}
          >
            <Flex justifyContent="space-between" alignItems="center" mt="2rem">
              <Text fontSize="xs" fontWeight="600" ms="0.25rem">
                {`Available balance: ${toCrypto(withdrawValue)}`}
              </Text>

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
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={loading}
                  isDisabled={!isDone && !isPremature}
                >
                  Withdraw
                </Button>
              </Flex>
            </Flex>
          </form>
        </Box>
      </Container>
    </Flex>
  )
}
