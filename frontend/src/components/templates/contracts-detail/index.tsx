import { Container, Flex, Skeleton } from '@chakra-ui/react'
import React from 'react'
import { FieldValues, UseFormSetValue } from 'react-hook-form'

import { havePermission } from 'utils'
import { MAX_PAGE_WIDTH_FULL } from 'utils/constants/sizes'

import { ContractInfo } from './components/contract-info'
import { Deposit } from './components/deposit'
import { DepositDetails } from './components/deposit-details'
import { Withdraw } from './components/withdraw'
import { WithdrawDetails } from './components/withdraw-details'
import { Permissions } from 'components/enums/permissions'
import { ContractsBreadcrumb } from 'components/molecules/contracts-breadcrumb'

interface IContractsDetailTemplate {
  onSubmitWithdraw(isPremature: boolean): Promise<void>
  onSubmitDeposit(
    data: FieldValues,
    setValue: UseFormSetValue<FieldValues>
  ): Promise<void>
  accessWallet(): void
  accessProfile(): void
  contractData: Hooks.UseContractsTypes.IContractData | undefined
  contract: Hooks.UseContractsTypes.IContract | undefined
  loading: boolean
  userAccount: string
  isWithdrawing: boolean
  isDepositing: boolean
  currentBalance: string
  history: Hooks.UseContractsTypes.IHistory[] | undefined
  deposited: number | undefined
  userPermissions: Hooks.UseAuthTypes.IUserPermission | undefined
  currentInVault: string | undefined
  hasAssetInVault: boolean
  hasWallet: boolean
  timerCounter: number | undefined
}

export const ContractsDetailTemplate: React.FC<IContractsDetailTemplate> = ({
  onSubmitWithdraw,
  onSubmitDeposit,
  accessWallet,
  accessProfile,
  contract,
  contractData,
  isWithdrawing,
  isDepositing,
  loading,
  currentBalance,
  history,
  deposited,
  userPermissions,
  currentInVault,
  hasAssetInVault,
  hasWallet,
  timerCounter,
}) => {
  return (
    <Flex flexDir="column" w="full" pb="3.5rem">
      <Flex
        maxW={MAX_PAGE_WIDTH_FULL}
        alignSelf="center"
        flexDir="column"
        w="full"
      >
        {loading || !contract ? (
          <Skeleton w="full" h="14rem" />
        ) : (
          <>
            <Flex justifyContent="space-between">
              <ContractsBreadcrumb title="Certificate Name" />
            </Flex>
            <Flex
              w="full"
              justifyContent="space-between"
              flexDir={{ base: 'column-reverse', md: 'row' }}
            >
              <Container
                variant="primary"
                mr="1.5rem"
                w="full"
                display="flex"
                maxW="full"
                gap="2rem"
              >
                <ContractInfo contract={contract} />

                {contractData?.position &&
                havePermission(
                  Permissions.INVEST_CERTIFICATE,
                  userPermissions
                ) ? (
                  <DepositDetails
                    contract={contract}
                    contractData={contractData}
                    currentBalance={currentBalance}
                    history={history}
                    deposited={deposited}
                  />
                ) : (
                  <WithdrawDetails
                    contract={contract}
                    contractData={contractData}
                    history={history}
                  />
                )}
              </Container>
              {contractData?.position ? (
                <Withdraw
                  onSubmit={onSubmitWithdraw}
                  contract={contract}
                  loading={isWithdrawing}
                  isDone={
                    contractData.timeLeft ? contractData.timeLeft < 0 : false
                  }
                  withdrawValue={
                    contractData.timeLeft && contractData.timeLeft > 0
                      ? Number(contractData.estimatedPrematureWithdraw)
                      : Number(contractData.position)
                  }
                  contractData={contractData}
                  deposited={deposited}
                  currentInVault={currentInVault}
                  timerCounter={timerCounter}
                />
              ) : (
                <Deposit
                  onSubmit={onSubmitDeposit}
                  accessWallet={accessWallet}
                  accessProfile={accessProfile}
                  contract={contract}
                  loading={isDepositing}
                  currentBalance={currentBalance}
                  hasAssetInVault={hasAssetInVault}
                  hasWallet={hasWallet}
                />
              )}
            </Flex>
          </>
        )}
      </Flex>
    </Flex>
  )
}
