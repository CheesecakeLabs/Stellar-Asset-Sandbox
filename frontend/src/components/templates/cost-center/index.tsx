import { Flex, Skeleton, Text, useMediaQuery } from '@chakra-ui/react'
import React from 'react'

import { MAX_PAGE_WIDTH } from 'utils/constants/sizes'

import { OpexCard } from './components/opex-card'
import { TransactionsCard } from './components/transactions-card'
import { MenuAdminMobile } from 'components/organisms/menu-admin-mobile'

import { IHorizonData } from 'app/core/pages/cost-center'

interface ICostCenterTemplate {
  transactions: Hooks.UseHorizonTypes.ITransactions | undefined
  userPermissions: Hooks.UseAuthTypes.IUserPermission | undefined
  accountData: Hooks.UseHorizonTypes.IAccount | undefined
  sponsorAccount: string | undefined
  latestFeeCharged: number | undefined
  vaults: Hooks.UseVaultsTypes.IVault[] | undefined
  assets: Hooks.UseAssetsTypes.IAssetDto[] | undefined
  isPrevDisabled: boolean
  mostRepeatedType: string | undefined
  loadingTransactions: boolean
  loadingOpex: boolean
  USDPrice: Hooks.UseAssetsTypes.IPriceConversion | undefined
  getTransactionsByLink(link: 'prev' | 'next'): void
  getTransactionData(
    transaction: Hooks.UseHorizonTypes.ITransactionItem
  ): IHorizonData
}

export const CostCenterTemplate: React.FC<ICostCenterTemplate> = ({
  transactions,
  accountData,
  latestFeeCharged,
  isPrevDisabled,
  mostRepeatedType,
  loadingTransactions,
  loadingOpex,
  USDPrice,
  getTransactionsByLink,
  getTransactionData,
}) => {
  const [isLargerThanLg] = useMediaQuery('(min-width: 992px)')

  return (
    <Flex flexDir="column" w="full">
      <Flex maxW={MAX_PAGE_WIDTH} alignSelf="center" flexDir="column" w="full">
        <Flex
          justifyContent="space-between"
          w="full"
          alignItems="center"
          mb="1.5rem"
        >
          <Text fontSize="2xl" fontWeight="400">
            Administration
          </Text>
          {!isLargerThanLg && <MenuAdminMobile selected={'COST_CENTER'} />}
        </Flex>
        <Flex flexDir="column" maxW="full">
          {loadingOpex ? (
            <Skeleton height="6rem" w="full" />
          ) : (
            <OpexCard
              accountData={accountData}
              latestFeeCharged={latestFeeCharged}
              mostRepeatedType={mostRepeatedType}
              USDPrice={USDPrice}
            />
          )}
          {loadingTransactions ? (
            <Skeleton height="10rem" w="full" />
          ) : (
            <TransactionsCard
              transactions={transactions}
              isPrevDisabled={isPrevDisabled}
              USDPrice={USDPrice}
              getTransactionsByLink={getTransactionsByLink}
              getTransactionData={getTransactionData}
            />
          )}
        </Flex>
      </Flex>
    </Flex>
  )
}
