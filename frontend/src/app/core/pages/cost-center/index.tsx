import { Flex, VStack, useMediaQuery } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'

import { useAssets } from 'hooks/useAssets'
import { useAuth } from 'hooks/useAuth'
import { useHorizon } from 'hooks/useHorizon'
import { useTransactions } from 'hooks/useTransactions'
import { useVaults } from 'hooks/useVaults'
import { GAService } from 'utils/ga'

import { PathRoute } from 'components/enums/path-route'
import { SettingsOptions } from 'components/enums/settings-options'
import { MenuSettings } from 'components/organisms/menu-settings'
import { Sidebar } from 'components/organisms/sidebar'
import { CostCenterTemplate } from 'components/templates/cost-center'

export const CostCenter: React.FC = () => {
  const [isLargerThanMd] = useMediaQuery('(min-width: 768px)')
  const [sponsorAccount, setSponsorAccount] = useState<string | undefined>()
  const [transactions, setTransactions] =
    useState<Hooks.UseHorizonTypes.ITransactions>()
  const [accountData, setAccountData] =
    useState<Hooks.UseHorizonTypes.IAccount>()
  const [latestFeeCharged, setLatestFeeCharged] = useState<number>()
  const [vaults, setVaults] = useState<Hooks.UseVaultsTypes.IVault[]>()
  const [assets, setAssets] = useState<Hooks.UseAssetsTypes.IAssetDto[]>()
  const [historyTransactions, setHistoryTransactions] = useState<
    Hooks.UseHorizonTypes.ITransactions[]
  >([])

  const { userPermissions, getUserPermissions } = useAuth()
  const { getSponsorPK } = useTransactions()
  const { getTransactions, getAccount } = useHorizon()
  const { getVaults } = useVaults()
  const { getAssets } = useAssets()

  useEffect(() => {
    GAService.GAPageView('Coast center')
  }, [])

  useEffect(() => {
    getUserPermissions()
    getSponsorPK().then(sponsor => setSponsorAccount(sponsor))
  }, [getUserPermissions, getSponsorPK])

  useEffect(() => {
    getVaults(true).then(vaults => setVaults(vaults))
  }, [getVaults])

  useEffect(() => {
    getAssets(true).then(assets => setAssets(assets))
  }, [getAssets])

  useEffect(() => {
    if (sponsorAccount) {
      getTransactions(sponsorAccount).then(transactions => {
        setTransactions(transactions)
        setLatestFeeCharged(
          transactions?._embedded.records.reduce(
            (total, transaction) => total + Number(transaction.fee_charged),
            0
          )
        )
      })
    }
  }, [sponsorAccount, getTransactions])

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
      setHistoryTransactions(history => [...history, transactions])
      getTransactions(undefined, link).then(transactions => {
        setTransactions(transactions)
      })
    }
  }

  return (
    <Flex>
      <Sidebar highlightMenu={PathRoute.SETTINGS}>
        <Flex
          flexDir={isLargerThanMd ? 'row' : 'column'}
          w="full"
          justifyContent="center"
          gap="1.5rem"
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
              getTransactionsByLink={getTransactionsByLink}
            />
          </Flex>
          {isLargerThanMd && (
            <VStack>
              <MenuSettings option={SettingsOptions.COST_CENTER} />
            </VStack>
          )}
        </Flex>
      </Sidebar>
    </Flex>
  )
}
