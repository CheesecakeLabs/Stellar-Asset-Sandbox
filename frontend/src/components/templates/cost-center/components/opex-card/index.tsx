import { Container, Flex, Progress, Text } from '@chakra-ui/react'
import React from 'react'

import { toCrypto } from 'utils/formatter'

interface IOpexCard {
  accountData: Hooks.UseHorizonTypes.IAccount | undefined
  latestFeeCharged: number | undefined
}

export const OpexCard: React.FC<IOpexCard> = ({
  accountData,
  latestFeeCharged,
}) => {
  const BASE_RESERVE = 0.5

  const getNativeBalance = (): Hooks.UseHorizonTypes.IBalance | undefined => {
    return accountData?.balances.find(
      balance => balance.asset_type === 'native'
    )
  }

  const getReserved = (): number => {
    const subentry =
      Number(accountData?.subentry_count || 0) +
      Number(accountData?.num_sponsoring || 0)
    const lockedReserves = subentry * BASE_RESERVE + 1
    return lockedReserves
  }

  const getProgress = (): number => {
    const totalBalance = Number(getNativeBalance()?.balance || 0)
    const reserved = getReserved()
    const result = ((totalBalance - reserved) / totalBalance) * 100
    return result
  }

  return (
    <>
      {!accountData ? (
        <div></div>
      ) : (
        <Container variant="primary" mb="1rem" p={4} w="full" maxW="full">
          <Text fontSize="md">Sandbox Expenses account</Text>
          <Text fontSize="sm" mt="1rem">
            Operating xpenses account
          </Text>
          <Text fontSize="xs" mt="0.25rem" opacity={0.75}>
            {accountData.account_id || '-'}
          </Text>
          <Text fontSize="sm" mt="1rem">
            Account balance
          </Text>

          <Flex flexDir="column" alignItems="center" w="full">
            <Text fontSize="sm" mt="1rem">
              {`${toCrypto(
                Number(getNativeBalance()?.balance) - getReserved()
              )} XLM avaliable / ${toCrypto(getReserved())} XLM reserved`}
            </Text>
            <Progress
              value={getProgress()}
              h="1rem"
              w="full"
              borderRadius="0.5rem"
              mt="0.25rem"
            />
            <Text fontSize="sm" mt="0.25rem">
              {`Total balance ${toCrypto(
                Number(getNativeBalance()?.balance)
              )} XLM`}
            </Text>
          </Flex>

          <Flex
            alignItems="center"
            w="full"
            justifyContent="space-between"
            mt="1rem"
          >
            <Flex flexDir="column" alignItems="center">
              <Text fontSize="sm" mt="1rem">
                Total sponsored reserves
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
                Total covered fees
              </Text>
              <Text fontSize="xs">(based on the last 10 transactions)</Text>
              <Text fontSize="sm" mt="0.25rem" fontWeight="700">
                {`${toCrypto(latestFeeCharged || 0, undefined, true)} XLM`}
              </Text>
            </Flex>
          </Flex>
        </Container>
      )}
    </>
  )
}
