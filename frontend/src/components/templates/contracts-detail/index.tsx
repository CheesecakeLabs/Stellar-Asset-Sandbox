import { Box, Flex, Img, SimpleGrid, Skeleton } from '@chakra-ui/react'
import React from 'react'
import { FieldValues, UseFormSetValue } from 'react-hook-form'

import { getCurrencyIcon } from 'utils/constants/constants'
import { MAX_PAGE_WIDTH } from 'utils/constants/sizes'
import { base64ToImg } from 'utils/converter'
import { toCrypto } from 'utils/formatter'

import { CompoundTime } from '../contracts-create/components/select-compound'
import { AccountCard } from './components/account-card'
import { Chart } from './components/chart'
import { Deposit } from './components/deposit'
import { ItemData } from './components/item-data'
import { Withdraw } from './components/withdraw'
import { Loading } from 'components/atoms'
import { ApyIcon, TimeIcon, WalletIcon } from 'components/icons'
import { ContractsBreadcrumb } from 'components/molecules/contracts-breadcrumb'

import { InfoCard } from '../../molecules/info-card'

interface IContractsDetailTemplate {
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
  balance: bigint
}

export const ContractsDetailTemplate: React.FC<IContractsDetailTemplate> = ({
  onSubmitWithdraw,
  onSubmitDeposit,
  contract,
  time,
  currentYield,
  deposit,
  userAccount,
  isWithdrawing,
  isDepositing,
  balance,
  loading,
}) => {
  return (
    <Flex flexDir="column" w="full">
      <Flex maxW={MAX_PAGE_WIDTH} alignSelf="center" flexDir="column" w="full">
        {loading || !contract ? (
          <Skeleton w="full" h="14rem" />
        ) : (
          <>
            <Flex justifyContent="space-between">
              <ContractsBreadcrumb title="Certificate Name" />
              <AccountCard account={userAccount} />
            </Flex>
            <Flex>
              <Flex flexDir="column" minW="20rem" mr="1.5rem">
                <ItemData
                  title={'ASSET'}
                  icon={
                    <Box
                      fill="black"
                      stroke="black"
                      _dark={{ fill: 'white', stroke: 'white' }}
                    >
                      {contract.asset.image ? (
                        <Img
                          src={base64ToImg(contract.asset.image)}
                          w="24px"
                          h="24px"
                        />
                      ) : (
                        getCurrencyIcon(contract.asset.code, '1.5rem')
                      )}
                    </Box>
                  }
                  value={contract.asset.name}
                />
                <ItemData
                  title={'TERM'}
                  icon={<TimeIcon />}
                  value={`${contract.term / 86400} day(s)`}
                />
                <ItemData
                  title={'APY'}
                  icon={<ApyIcon />}
                  value={`${contract.yield_rate/100}%, ${
                    contract.compound === 0
                      ? 'simple interest, does not compound'
                      : `every ${CompoundTime[contract.compound]}`
                  }`}
                />
                <ItemData
                  title={`DEPOSITED (${contract.asset.code})`}
                  icon={<WalletIcon />}
                  value={'-'}
                />
              </Flex>
              <Flex flexDir="column" w="full">
                {userAccount && balance && balance > 0 ? (
                  <Flex>
                    <Chart
                      title={'BALANCE'}
                      value={
                        balance && balance > 0
                          ? toCrypto(Number(balance) / 10000000)
                          : '-'
                      }
                    />
                    <Chart
                      title={'DUE IN'}
                      value={`${time ? `${time.toString()} seconds` : '-'}`}
                    />
                    <Chart
                      title={'CURRENT YIELD'}
                      value={
                        balance
                          ? `${(
                              (currentYield / (10000 * 10000000)) *
                              100
                            ).toFixed(2)} %`
                          : '-'
                      }
                    />
                  </Flex>
                ) : (
                  <div />
                )}
                {balance ? (
                  <Withdraw
                    onSubmit={onSubmitWithdraw}
                    contract={contract}
                    loading={isWithdrawing}
                    isDone={!time || time === BigInt(0)}
                    withdrawValue={
                      time > 0
                        ? Number(deposit) + Number(currentYield / 2)
                        : Number(balance)
                    }
                  />
                ) : (
                  <Deposit
                    onSubmit={onSubmitDeposit}
                    contract={contract}
                    loading={isDepositing}
                  />
                )}
              </Flex>
            </Flex>
          </>
        )}
      </Flex>
    </Flex>
  )
}
