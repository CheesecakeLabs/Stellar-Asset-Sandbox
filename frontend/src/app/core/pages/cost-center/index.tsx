import { Flex, VStack, useMediaQuery, Text } from '@chakra-ui/react'
import React, { useCallback, useEffect, useState } from 'react'

import { useAssets } from 'hooks/useAssets'
import { useAuth } from 'hooks/useAuth'
import { useHorizon } from 'hooks/useHorizon'
import { useTransactions } from 'hooks/useTransactions'
import { useVaults } from 'hooks/useVaults'
import {
  operatingExpensesHelperP1,
  operatingExpensesHelperP2,
} from 'utils/constants/helpers'
import { GAService } from 'utils/ga'

import { PathRoute } from 'components/enums/path-route'
import { SettingsOptions } from 'components/enums/settings-options'
import { ActionHelper } from 'components/molecules/action-helper'
import { MenuSettings } from 'components/organisms/menu-settings'
import { Sidebar } from 'components/organisms/sidebar'
import { CostCenterTemplate } from 'components/templates/cost-center'

export interface IHorizonData {
  name: string
  type: string
  asset: string
}

export const CostCenter: React.FC = () => {
  const [isLargerThanLg] = useMediaQuery('(min-width: 992px)')

  const [sponsorAccount, setSponsorAccount] = useState<string | undefined>()
  const [loadingTransactions, setLoadingTransactions] = useState<boolean>(true)
  const [loadingOpex, setLoadingOpex] = useState<boolean>(true)
  const [transactions, setTransactions] =
    useState<Hooks.UseHorizonTypes.ITransactions>()
  const [accountData, setAccountData] =
    useState<Hooks.UseHorizonTypes.IAccount>()
  const [latestFeeCharged, setLatestFeeCharged] = useState<number>()
  const [mostRepeatedType, setMostRepeatedType] = useState<string>()

  const [vaults, setVaults] = useState<Hooks.UseVaultsTypes.IVault[]>()
  const [assets, setAssets] = useState<Hooks.UseAssetsTypes.IAssetDto[]>()
  const [historyTransactions, setHistoryTransactions] = useState<
    Hooks.UseHorizonTypes.ITransactions[]
  >([])
  const [USDPrice, setUSDPrice] =
    useState<Hooks.UseAssetsTypes.IPriceConversion>()

  const { userPermissions, getUserPermissions } = useAuth()
  const { getSponsorPK } = useTransactions()
  const { getTransactions, getAccount } = useHorizon()
  const { getVaults } = useVaults()
  const { getAssets, getUSDPrice } = useAssets()

  useEffect(() => {
    GAService.GAPageView('Coast center')
  }, [])

  useEffect(() => {
    getUserPermissions()
    getSponsorPK().then(sponsor => {
      setSponsorAccount(sponsor)
      setLoadingOpex(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    getVaults(true).then(vaults => setVaults(vaults))
  }, [getVaults])

  useEffect(() => {
    getUSDPrice().then(USDPrice => setUSDPrice(USDPrice))
  }, [getUSDPrice])

  useEffect(() => {
    getAssets(true).then(assets => setAssets(assets))
  }, [getAssets])

  useEffect(() => {
    if (sponsorAccount) {
      getAccount(sponsorAccount).then(account => setAccountData(account))
    }
  }, [sponsorAccount, getTransactions, getAccount])

  const getTransactionsByLink = (action: 'prev' | 'next'): void => {
    if (action === 'prev') {
      const transactionsPrev =
        historyTransactions[historyTransactions.length - 1]
      setTransactions(transactionsPrev)
      setHistoryTransactions(previous => previous.slice(0, -1))
      return
    }

    const link = transactions?._links.next.href
    if (link) {
      setLoadingTransactions(true)
      setHistoryTransactions(history => [...history, transactions])
      getTransactions(undefined, link).then(transactions => {
        setTransactions(transactions)
        setLoadingTransactions(false)
      })
    }
  }

  const formatAccount = (account: string): string => {
    return `${account.substring(0, 4)}...${account.substring(
      account.length - 4,
      account.length
    )}`
  }

  const walletToName = useCallback(
    (publicKey: string): string => {
      if (
        assets &&
        assets.find(asset => asset.distributor.key.publicKey === publicKey)
      ) {
        return 'Asset issuer'
      }

      return (
        vaults?.find(vault => vault.wallet.key.publicKey === publicKey)?.name ||
        formatAccount(publicKey)
      )
    },
    [assets, vaults]
  )

  const getTransactionData = useCallback(
    (transaction: Hooks.UseHorizonTypes.ITransactionItem): IHorizonData => {
      const accountCreated = transaction.operations?.find(
        operation => operation.type === 'create_account'
      )
      if (accountCreated) {
        return {
          name: walletToName(accountCreated.account || ''),
          type: 'Account created',
          asset: '-',
        }
      }

      const payment = transaction.operations?.find(
        operation => operation.type === 'payment'
      )

      if (
        payment &&
        assets?.find(asset => asset.distributor.key.publicKey === payment.to)
      ) {
        return {
          name: '-',
          type: 'Minted',
          asset: payment.asset_code || '-',
        }
      }

      if (
        payment &&
        assets?.find(asset => asset.distributor.key.publicKey === payment.from)
      ) {
        return {
          name: '-',
          type: assets?.find(asset => asset.issuer.key.publicKey === payment.to)
            ? 'Burned'
            : 'Distribute',
          asset: payment.asset_code || '-',
        }
      }

      if (payment) {
        return {
          name: `${walletToName(payment.from || '')} to ${walletToName(
            payment.to || '-'
          )}`,
          type: 'Payment',
          asset: payment.asset_code || '-',
        }
      }

      const contractInvoke = transaction.operations?.find(
        operation => operation.type === 'invoke_host_function'
      )
      if (contractInvoke) {
        return {
          name: walletToName(contractInvoke.source_account || ''),
          type: 'Contract invoke',
          asset: '-',
        }
      }

      const trustlineOperation = transaction.operations?.find(
        operation => operation.type === 'set_trust_line_flags'
      )

      if (trustlineOperation) {
        if (trustlineOperation.set_flags_s?.includes('authorized')) {
          return {
            name: walletToName(trustlineOperation.trustor || ''),
            type: 'Authorized',
            asset: trustlineOperation.asset_code || '-',
          }
        }

        if (trustlineOperation.clear_flags_s?.includes('authorized')) {
          return {
            name: walletToName(trustlineOperation.trustor || ''),
            type: 'Freezed',
            asset: trustlineOperation.asset_code || '-',
          }
        }
      }

      const clawback = transaction.operations?.find(
        operation => operation.type === 'clawback'
      )

      if (clawback) {
        return {
          name: walletToName(clawback.from || ''),
          type: 'Clawbacked',
          asset: clawback.asset_code || '-',
        }
      }

      const changeTrust = transaction.operations?.find(
        operation => operation.type === 'change_trust'
      )
      if (changeTrust) {
        return {
          name: walletToName(changeTrust.trustor || ''),
          type: 'Change trustline',
          asset: changeTrust.asset_code || '-',
        }
      }

      const contractRestore = transaction.operations?.find(
        operation => operation.type === 'restore_footprint'
      )
      if (contractRestore) {
        return {
          name: walletToName(contractRestore.source_account || ''),
          type: 'Contract restore',
          asset: '-',
        }
      }

      return {
        name: '-',
        type: '-',
        asset: '-',
      }
    },
    [assets, walletToName]
  )

  const getMostRepeatedType = useCallback(
    (transactions: Hooks.UseHorizonTypes.ITransactions | undefined): void => {
      const counter: Record<string, number> = {}

      transactions?._embedded.records.forEach(transaction => {
        const transactionData = getTransactionData(transaction)
        counter[transactionData.type] = (counter[transactionData.type] || 0) + 1
      })

      let mostRepeatedType: string | undefined
      let maxOccurrences = 0

      for (const type in counter) {
        if (counter[type] > maxOccurrences) {
          maxOccurrences = counter[type]
          mostRepeatedType = type
        }
      }

      setMostRepeatedType(mostRepeatedType)
    },
    [getTransactionData]
  )

  useEffect(() => {
    if (sponsorAccount) {
      setLoadingTransactions(true)
      getTransactions(sponsorAccount).then(
        (transactions: Hooks.UseHorizonTypes.ITransactions | undefined) => {
          setTransactions(transactions)
          setLatestFeeCharged(
            transactions?._embedded.records.reduce(
              (total, transaction) => total + Number(transaction.fee_charged),
              0
            )
          )
          getMostRepeatedType(transactions)
          setLoadingTransactions(false)
        }
      )
    }
  }, [sponsorAccount, getTransactions, getMostRepeatedType])

  return (
    <Flex>
      <Sidebar highlightMenu={PathRoute.SETTINGS}>
        <Flex
          flexDir={isLargerThanLg ? 'row' : 'column'}
          w="full"
          justifyContent="center"
          gap="1.5rem"
          pb="3.5rem"
        >
          <Flex maxW="966px" flexDir="column" w="full">
            <CostCenterTemplate
              transactions={transactions}
              userPermissions={userPermissions}
              sponsorAccount={sponsorAccount}
              accountData={accountData}
              latestFeeCharged={latestFeeCharged}
              vaults={vaults}
              assets={assets}
              isPrevDisabled={historyTransactions.length === 0}
              mostRepeatedType={mostRepeatedType}
              loadingTransactions={loadingTransactions}
              USDPrice={USDPrice}
              getTransactionsByLink={getTransactionsByLink}
              getTransactionData={getTransactionData}
              loadingOpex={loadingOpex}
            />
          </Flex>
          {isLargerThanLg && (
            <VStack>
              <MenuSettings option={SettingsOptions.COST_CENTER} />
              <ActionHelper title={'About Operating Expenses'}>
                <Text color="gray.900" lineHeight="22px" fontSize="sm">
                  {operatingExpensesHelperP1}
                </Text>
                <Text
                  color="gray.900"
                  lineHeight="22px"
                  fontSize="sm"
                  mt="1rem"
                >
                  {operatingExpensesHelperP2}
                </Text>
              </ActionHelper>
            </VStack>
          )}
          {!isLargerThanLg && (
            <ActionHelper title={'About Operating Expenses'}>
              <Text color="gray.900" lineHeight="22px" fontSize="sm">
                {operatingExpensesHelperP1}
              </Text>
              <Text color="gray.900" lineHeight="22px" fontSize="sm" mt="1rem">
                {operatingExpensesHelperP2}
              </Text>
            </ActionHelper>
          )}
        </Flex>
      </Sidebar>
    </Flex>
  )
}
