import { Flex, useToast } from '@chakra-ui/react'
import React, { useCallback, useEffect, useState } from 'react'
import { FieldValues, UseFormSetValue } from 'react-hook-form'
import { useParams } from 'react-router-dom'

import { useAuth } from 'hooks/useAuth'
import { useContracts } from 'hooks/useContracts'
import { MessagesError } from 'utils/constants/messages-error'

import { PathRoute } from 'components/enums/path-route'
import { Sidebar } from 'components/organisms/sidebar'
import { ContractsDetailTemplate } from 'components/templates/contracts-detail'

export const ContractsDetail: React.FC = () => {
  const {
    isDepositing,
    isWithdrawing,
    getContract,
    getPosition,
    getYield,
    getTimeLeft,
    withdraw,
    deposit,
    getEstimatedPrematureWithdraw,
  } = useContracts()
  const { profile, getProfile } = useAuth()
  const toast = useToast()

  const [loadingPosition, setLoadingPosition] = useState(true)
  const [pauseProcess, setPauseProcess] = useState(false)
  const [contract, setContract] = useState<Hooks.UseContractsTypes.IContract>()
  const [contractData, setContractData] =
    useState<Hooks.UseContractsTypes.IContractData>()

  const { id } = useParams()

  useEffect(() => {
    getProfile()
  }, [getProfile])

  const loadContractData = async (): Promise<void> => {
    console.log('carregou')
    if (profile && contract) {
      const wallet = profile.vault.wallet.key.publicKey

      const position =
        ((await getPosition(wallet, contract.address)) || BigInt(0)) /
        BigInt(10000000)

      const userYield =
        ((await getYield(wallet, contract.address)) || BigInt(0)) /
        BigInt(10000000)

      const estimatedPrematureWithdraw = await getEstimatedPrematureWithdraw(
        wallet,
        contract.address
      )

      const timeLeft = await getTimeLeft(wallet, contract.address)

      setContractData({
        position: Number(position),
        deposited: Number(position) - Number(userYield),
        yield: Number(userYield || 0),
        estimatedPrematureWithdraw: Number(estimatedPrematureWithdraw || 0),
        timeLeft: Number(timeLeft),
      })

      setLoadingPosition(false)
    }
  }

  useEffect(() => {
    loadContractData()
  }, [profile, contract])

  useEffect(() => {
    if (id) {
      getContract(id).then(contract => {
        setContract(contract)
      })
    }
  }, [getContract, id, profile])

  const updatePeriodically = useCallback((): void => {
    setInterval(loadContractData, 60000)
  }, [loadContractData])

  useEffect(() => {
    updatePeriodically()
  }, [])

  const onSubmitDeposit = async (
    data: FieldValues,
    setValue: UseFormSetValue<FieldValues>
  ): Promise<void> => {
    if (!contract || !profile?.vault) return

    try {
      const isSuccess = await deposit(
        BigInt(data.amount),
        profile.vault.wallet.key.publicKey,
        contract.address,
        profile.vault.wallet.key.publicKey
      )

      if (isSuccess) {
        loadContractData()
        setValue('amount', '')

        toast({
          title: 'Deposit success!',
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: 'top-right',
        })

        return
      }

      toastError(MessagesError.errorOccurred)
    } catch (error) {
      let message
      if (error instanceof Error) message = error.message
      else message = String(error)
      toastError(message)
    }
  }

  const onSubmitWithdraw = async (isPremature: boolean): Promise<void> => {
    if (!contract || !profile) return

    try {
      setPauseProcess(isPremature)
      const isSuccess = await withdraw(
        profile.vault.wallet.key.publicKey,
        true,
        contract.address
      )

      if (isSuccess) {
        loadContractData()
        toast({
          title: 'Withdraw success!',
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: 'top-right',
        })

        return
      }

      toastError(MessagesError.errorOccurred)
      setPauseProcess(false)
    } catch (error) {
      let message
      if (error instanceof Error) message = error.message
      else message = String(error)
      toastError(message)
      setPauseProcess(false)
    }
  }

  const toastError = (message: string): void => {
    toast({
      title: 'Error!',
      description: message,
      status: 'error',
      duration: 9000,
      isClosable: true,
      position: 'top-right',
    })
  }

  return (
    <Flex>
      <Sidebar highlightMenu={PathRoute.SOROBAN_SMART_CONTRACTS}>
        <ContractsDetailTemplate
          onSubmitWithdraw={onSubmitWithdraw}
          onSubmitDeposit={onSubmitDeposit}
          loading={loadingPosition}
          contract={contract}
          userAccount={profile?.vault.wallet.key.publicKey}
          isDepositing={isDepositing}
          isWithdrawing={isWithdrawing}
          contractData={contractData}
        />
      </Sidebar>
    </Flex>
  )
}
