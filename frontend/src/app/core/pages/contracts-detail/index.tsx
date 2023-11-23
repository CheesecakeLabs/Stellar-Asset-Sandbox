import { Flex, useToast } from '@chakra-ui/react'
import React, { useCallback, useEffect, useState } from 'react'
import { FieldValues, UseFormSetValue } from 'react-hook-form'

import { useContracts } from 'hooks/useContracts'
import { MessagesError } from 'utils/constants/messages-error'

import { PathRoute } from 'components/enums/path-route'
import { Sidebar } from 'components/organisms/sidebar'
import { ContractsDetailTemplate } from 'components/templates/contracts-detail'
import { useParams } from 'react-router-dom'
import { useAuth } from 'hooks/useAuth'

export const ContractsDetail: React.FC = () => {
  const {
    loading,
    isDepositing,
    isWithdrawing,
    getContract,
    getPosition,
    getYield,
    getTime,
    withdraw,
    deposit
  } = useContracts()
  const { profile, getProfile } = useAuth()
  const toast = useToast()

  const [userPosition, setUserPosition] = useState<bigint>(BigInt(0))
  const [userYield, setUserYield] = useState<bigint>(BigInt(0))
  const [time, setTime] = useState<bigint>(BigInt(0))
  const [userDeposit, setUserDeposit] = useState(0)
  const [pauseProcess, setPauseProcess] = useState(false)
  const [contract, setContract] = useState<Hooks.UseContractsTypes.IContract>()

  const { id } = useParams()

  useEffect(() => {
    getProfile()
  }, [getProfile])

  const updatePosition = useCallback((): void => {
    if (!pauseProcess && contract) {
      /*getPosition(setUserPosition, userAccount, contract.address)
      getYield(setUserYield, userAccount, contract.address)
      getTime(setTime, userAccount, contract.address)*/
    }
  }, [getPosition, getTime, getYield, pauseProcess, profile, contract])

  /*const updatePositionPeriodically = useCallback((): void => {
    setInterval(updatePosition, 1000)
  }, [updatePosition])*/

  useEffect(() => {
    if (profile && contract) {
      getPosition(updatePosition, profile.vault.wallet.key.publicKey, contract.address)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, contract])

  /*useEffect(() => {
    if (userDeposit === 0 && userPosition > 0 && userYield > 0) {
      setUserDeposit(Number(userPosition) - Number(userYield))
    }
  }, [userAccount, userDeposit, userPosition, userYield])*/

  useEffect(() => {
    if (id) {
      getContract(id).then(contract => {
        setContract(contract)
        if (contract && profile) {
          getPosition(updatePosition, profile.vault.wallet.key.publicKey, contract.address)
        }
        console.log(contract)
      })
    }
  }, [getContract, id, profile])

  const onSubmitDeposit = async (
    data: FieldValues,
    setValue: UseFormSetValue<FieldValues>
  ): Promise<void> => {
    if (!contract || !profile?.vault) return

    try {
      const isSuccess = await deposit(
        BigInt(data.amount),
        profile.vault.wallet.key.publicKey,
        updatePosition(),
        contract.address,
        profile.vault.wallet.key.publicKey
      )
      setUserDeposit(data.amount)

      if (isSuccess) {
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
        updatePosition(),
        contract.address
      )

      if (isSuccess) {
        setUserDeposit(0)
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
          loading={loading}
          contract={contract}
          time={time}
          userAccount={profile?.vault.wallet.key.publicKey}
          isDepositing={isDepositing}
          isWithdrawing={isWithdrawing}
          currentYield={Number(userYield)}
          deposit={userDeposit}
          balance={Number(userPosition)}
          onSubmitWithdraw={onSubmitWithdraw}
          onSubmitDeposit={onSubmitDeposit}
        />
      </Sidebar>
    </Flex>
  )
}
