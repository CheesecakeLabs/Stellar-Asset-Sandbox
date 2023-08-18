import { Flex, useToast } from '@chakra-ui/react'
import React, { useCallback, useEffect, useState } from 'react'
import { FieldValues, UseFormSetValue } from 'react-hook-form'

import { useContracts } from 'hooks/useContracts'
import { MessagesError } from 'utils/constants/messages-error'

import { PathRoute } from 'components/enums/path-route'
import { Sidebar } from 'components/organisms/sidebar'
import { ContractsDetailTemplate } from 'components/templates/contracts-detail'

export const ContractsDetail: React.FC = () => {
  const {
    loading,
    contract,
    isDepositing,
    isWithdrawing,
    getContract,
    getPosition,
    getYield,
    getTime,
    withdraw,
    getAccount,
    deposit,
  } = useContracts()
  const toast = useToast()

  const [userPosition, setUserPosition] = useState<bigint>(BigInt(0))
  const [userYield, setUserYield] = useState<bigint>(BigInt(0))
  const [userAccount, setUserAccount] = useState<string>('')
  const [time, setTime] = useState<bigint>(BigInt(0))
  const [userDeposit, setUserDeposit] = useState(0)
  const [pauseProcess, setPauseProcess] = useState(false)

  const updatePosition = useCallback((): void => {
    if (!pauseProcess) {
      getPosition(setUserPosition, userAccount)
      getYield(setUserYield, userAccount)
      getTime(setTime, userAccount)
    }
  }, [getPosition, getTime, getYield, pauseProcess, userAccount])

  const updatePositionPeriodically = useCallback((): void => {
    setInterval(updatePosition, 1000)
  }, [updatePosition])

  useEffect(() => {
    if (userAccount) {
      updatePositionPeriodically()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAccount])

  useEffect(() => {
    if (userDeposit === 0 && userPosition > 0 && userYield > 0) {
      setUserDeposit(Number(userPosition) - Number(userYield))
    }
  }, [userAccount, userDeposit, userPosition, userYield])

  useEffect(() => {
    getContract('1')
  }, [getContract])

  useEffect(() => {
    getAccount(setUserAccount)
  }, [getAccount, getContract])

  const onSubmitDeposit = async (
    data: FieldValues,
    setValue: UseFormSetValue<FieldValues>
  ): Promise<void> => {
    try {
      const isSuccess = await deposit(BigInt(data.amount), userAccount)
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
    try {
      setPauseProcess(isPremature)
      const isSuccess = await withdraw(
        userAccount,
        true,
        updatePosition()
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

  const onClickGetAccount = (): void => {
    getAccount(setUserAccount)
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
          userAccount={userAccount}
          isDepositing={isDepositing}
          isWithdrawing={isWithdrawing}
          currentYield={Number(userYield)}
          deposit={userDeposit}
          balance={Number(userPosition)}
          onSubmitWithdraw={onSubmitWithdraw}
          onClickGetAccount={onClickGetAccount}
          onSubmitDeposit={onSubmitDeposit}
        />
      </Sidebar>
    </Flex>
  )
}
