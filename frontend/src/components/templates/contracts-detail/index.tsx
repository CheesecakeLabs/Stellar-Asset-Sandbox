import { Box, Flex, SimpleGrid } from '@chakra-ui/react'
import React from 'react'
import { FieldValues, UseFormSetValue } from 'react-hook-form'

import { getCurrencyIcon } from 'utils/constants/constants'
import { toCrypto } from 'utils/formatter'

import { AccountCard } from './components/account-card'
import { Chart } from './components/chart'
import { Deposit } from './components/deposit'
import { InfoCard } from './components/info-card'
import { Withdraw } from './components/withdraw'
import { Loading } from 'components/atoms'
import { ApyIcon, TimeIcon, WalletIcon } from 'components/icons'
import { ContractsBreadcrumb } from 'components/molecules/contracts-breadcrumb'

interface IContractsDetailTemplate {
  onClickGetAccount(): void
  onSubmitWithdraw(isPremature: boolean): Promise<void>
  onSubmitDeposit(
    data: FieldValues,
    setValue: UseFormSetValue<FieldValues>
  ): Promise<void>
  contract: Hooks.UseContractsTypes.IContract | undefined
  loading: boolean
  time: bigint
  currentYield: number
  deposit: number
  userAccount: string
  isWithdrawing: boolean
  isDepositing: boolean
  balance: number
}

export const ContractsDetailTemplate: React.FC<IContractsDetailTemplate> = ({
  onSubmitWithdraw,
  onSubmitDeposit,
  onClickGetAccount,
  contract,
  time,
  currentYield,
  deposit,
  userAccount,
  isWithdrawing,
  isDepositing,
  balance,
}) => {
  return (
    <Flex flexDir="column" w="full">
      <Flex maxW="860px" alignSelf="center" flexDir="column" w="full">
        {contract ? (
          <>
            <Flex justifyContent="space-between">
              <ContractsBreadcrumb title="Certificate Name" />
              <AccountCard account={userAccount} onClick={onClickGetAccount} />
            </Flex>
            <SimpleGrid columns={{ md: 4, sm: 2 }} spacing={3}>
              <InfoCard
                title={'ASSET'}
                icon={
                  <Box
                    fill="black"
                    stroke="black"
                    _dark={{ fill: 'white', stroke: 'white' }}
                  >
                    {getCurrencyIcon(contract.asset.code, '1.5rem')}{' '}
                  </Box>
                }
                value={contract.asset.name}
              />
              <InfoCard
                title={'TERM'}
                icon={<TimeIcon />}
                value={`${contract.term} seconds`}
              />
              <InfoCard
                title={'APY'}
                icon={<ApyIcon />}
                value={`${contract.yield_rate}%`}
              />
              <InfoCard
                title={`DEPOSITED (${contract.asset.code})`}
                icon={<WalletIcon />}
                value={toCrypto(deposit || 0)}
              />
            </SimpleGrid>
            {userAccount && balance && balance > 0 ? (
              <SimpleGrid columns={{ md: 3, sm: 1 }} spacing={3} mt="1rem">
                <Chart
                  title={'BALANCE'}
                  value={balance && balance > 0 ? toCrypto(balance) : '-'}
                />
                <Chart
                  title={'DUE IN'}
                  value={`${time ? `${time.toString()} seconds` : '-'}`}
                />
                <Chart
                  title={'CURRENT YIELD'}
                  value={
                    balance && deposit && deposit > 0
                      ? `${((currentYield / deposit) * 100).toFixed(2)} %`
                      : '-'
                  }
                />
              </SimpleGrid>
            ) : (
              <div />
            )}
            {userAccount &&
              (balance && balance > 0 ? (
                <Withdraw
                  onSubmit={onSubmitWithdraw}
                  contract={contract}
                  loading={isWithdrawing}
                  isDone={!time || time === BigInt(0)}
                  withdrawValue={
                    time > 0
                      ? Number(deposit) + Number(currentYield / 2)
                      : balance
                  }
                />
              ) : (
                <Deposit
                  onSubmit={onSubmitDeposit}
                  contract={contract}
                  loading={isDepositing}
                />
              ))}
          </>
        ) : (
          <Loading />
        )}
      </Flex>
    </Flex>
  )
}
