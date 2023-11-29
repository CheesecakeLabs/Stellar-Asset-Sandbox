import { Container, Flex, Skeleton, Text } from '@chakra-ui/react'
import React from 'react'
import { FieldValues, UseFormSetValue } from 'react-hook-form'

import { ContractInfo } from './components/contract-info'
import { Deposit } from './components/deposit'
import { DepositDetails } from './components/deposit-details'
import { Withdraw } from './components/withdraw'
import { ContractsBreadcrumb } from 'components/molecules/contracts-breadcrumb'

interface IContractsDetailTemplate {
  onSubmitWithdraw(isPremature: boolean): Promise<void>
  onSubmitDeposit(
    data: FieldValues,
    setValue: UseFormSetValue<FieldValues>
  ): Promise<void>
  contractData: Hooks.UseContractsTypes.IContractData | undefined
  contract: Hooks.UseContractsTypes.IContract | undefined
  loading: boolean
  userAccount: string
  isWithdrawing: boolean
  isDepositing: boolean
}

export const ContractsDetailTemplate: React.FC<IContractsDetailTemplate> = ({
  onSubmitWithdraw,
  onSubmitDeposit,
  contract,
  contractData,
  isWithdrawing,
  isDepositing,
  loading,
}) => {
  return (
    <Flex flexDir="column" w="full">
      <Flex maxW="full" alignSelf="center" flexDir="column" w="full">
        {loading || !contract ? (
          <Skeleton w="full" h="14rem" />
        ) : (
          <>
            <Flex justifyContent="space-between">
              <ContractsBreadcrumb title="Certificate Name" />
            </Flex>
            <Flex w="full" justifyContent="space-between">
              <Container
                variant="primary"
                mr="1.5rem"
                w="full"
                display="flex"
                flexDir="row"
                maxW="full"
                gap="2rem"
              >
                <Flex flexDir="column">
                  <Text fontSize="sm" mb="0.5rem" ms="0.25rem">
                    Contract details
                  </Text>
                  <ContractInfo contract={contract} />
                </Flex>

                <Flex flexDir="column" w="full">
                  <Text fontSize="sm" mb="0.5rem" ms="0.25rem">
                    Deposit details
                  </Text>
                  <DepositDetails
                    contract={contract}
                    contractData={contractData}
                  />
                </Flex>
              </Container>
              {contractData?.position ? (
                <Withdraw
                  onSubmit={onSubmitWithdraw}
                  contract={contract}
                  loading={isWithdrawing}
                  isDone={!contractData.timeLeft || contractData.timeLeft === 0}
                  withdrawValue={
                    contractData.timeLeft > 0
                      ? Number(contractData.deposited) +
                        Number(contractData.yield / 2)
                      : Number(contractData.position)
                  }
                  contractData={contractData}
                />
              ) : (
                <Deposit
                  onSubmit={onSubmitDeposit}
                  contract={contract}
                  loading={isDepositing}
                />
              )}
            </Flex>
          </>
        )}
      </Flex>
    </Flex>
  )
}
