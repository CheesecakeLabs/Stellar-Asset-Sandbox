import { Flex, useToast } from '@chakra-ui/react'
import React, { useCallback, useEffect, useState } from 'react'
import { FieldValues, UseFormSetValue } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'

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
    addContractHistory,
    updateContractHistory,
  } = useContracts()
  const { getProfile } = useAuth()
  const { getHistory } = useContracts()
  const { userPermissions, getUserPermissions } = useAuth()
  const toast = useToast()

  const [loadingPosition, setLoadingPosition] = useState(true)
  const [contract, setContract] = useState<Hooks.UseContractsTypes.IContract>()
  const [profile, setProfile] = useState<Hooks.UseAuthTypes.IUserDto>()
  const [contractData, setContractData] =
    useState<Hooks.UseContractsTypes.IContractData>()
  const [history, setHistory] = useState<Hooks.UseContractsTypes.IHistory[]>()
  const [currentInVault, setCurrentInVault] = useState<string>()
  const [timerCounter, setTimerCounter] = useState<number>()

  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    getUserPermissions()
  }, [getUserPermissions])

  const loadTimer = useCallback(async (): Promise<void> => {
    if (id) {
      const contract = await getContract(id)
      setContract(contract)
      const profile = await getProfile()
      setProfile(profile)

      if (profile && contract) {
        const wallet = profile.vault?.wallet.key.publicKey

        let timeLeft = contractData?.timeLeft

        const position =
          Number((await getPosition(wallet, contract.address, wallet)) || 0) /
          10000000

        timeLeft =
          position > 0
            ? Number((await getTimeLeft(wallet, contract.address, wallet)) || 0)
            : 0

        setTimerCounter(Date.now() + (timeLeft || 0) * 1000)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const loadContractData = useCallback(async (): Promise<void> => {
    if (id) {
      const contract = await getContract(id)
      setContract(contract)
      const profile = await getProfile()
      setProfile(profile)

      if (contract) {
        getHistory(contract.id).then(history => setHistory(history))
      }

      if (profile && contract) {
        const wallet = profile.vault?.wallet.key.publicKey

        let timeLeft = contractData?.timeLeft

        const position =
          Number((await getPosition(wallet, contract.address, wallet)) || 0) /
          10000000

        const userYield =
          Number((await getYield(wallet, contract.address, wallet)) || 0) /
          10000000

        const estimatedPrematureWithdraw =
          Number(
            (await getEstimatedPrematureWithdraw(
              wallet,
              contract.address,
              wallet
            )) || 0
          ) / 10000000

        if (!timeLeft) {
          timeLeft =
            position > 0
              ? Number(
                  (await getTimeLeft(wallet, contract.address, wallet)) || 0
                )
              : 0
        }

        setContractData({
          position: Number(position),
          yield: Number(userYield || 0),
          estimatedPrematureWithdraw: Number(estimatedPrematureWithdraw || 0),
          timeLeft: Number(timeLeft),
        })

        setCurrentInVault(
          contract?.vault.accountData?.balances.find(
            balance =>
              balance.asset_code === contract?.asset?.code &&
              balance.asset_issuer === contract?.asset?.issuer.key.publicKey
          )?.balance
        )

        setLoadingPosition(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const updatePeriodically = useCallback((): NodeJS.Timer => {
    return setInterval(loadContractData, 10000)
  }, [loadContractData])

  useEffect(() => {
    const interval = updatePeriodically()
    loadTimer()
    loadContractData()

    return () => {
      clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (contract) {
      getHistory(contract.id).then(history => setHistory(history))
    }
  }, [getHistory, contract])

  const onSubmitDeposit = async (
    data: FieldValues,
    setValue: UseFormSetValue<FieldValues>
  ): Promise<void> => {
    if (!contract || !profile?.vault) return

    try {
      const isSuccess = await deposit(
        BigInt(data.amount * 10000000),
        profile.vault.wallet.key.publicKey,
        contract.address,
        profile.vault.wallet.key.publicKey
      )

      if (isSuccess) {
        loadContractData()
        await addContractHistory({
          deposit_amount: Number(data.amount),
          contract_id: contract.id,
        })

        setValue('amount', '')
        await getProfile()
        const history = await getHistory(contract.id)
        setHistory(history)

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

  const onSubmitWithdraw = async (): Promise<void> => {
    if (!contract || !profile) return

    try {
      const isSuccess = await withdraw(
        profile.vault.wallet.key.publicKey,
        true,
        contract.address,
        profile.vault?.wallet.key.publicKey
      )

      if (isSuccess) {
        loadContractData()
        await updateContractHistory({
          withdraw_amount: contractData?.position || 0,
          contract_id: contract.id,
        })
        getHistory(contract.id).then(history => setHistory(history))
        await getProfile()
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
    } catch (error) {
      let message
      if (error instanceof Error) message = error.message
      else message = String(error)
      toastError(message)
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

  const getCurrentBalance = (): string => {
    return (
      profile?.vault?.accountData?.balances.find(
        balance =>
          balance.asset_code === contract?.asset?.code &&
          balance.asset_issuer === contract?.asset?.issuer.key.publicKey
      )?.balance || ''
    )
  }

  const getDepositedValue = (): number | undefined => {
    return history ? history[0]?.deposit_amount : undefined
  }

  const hasAssetInVault = (): boolean => {
    return (
      profile?.vault?.accountData?.balances.find(
        balance =>
          balance.asset_code === contract?.asset.code &&
          balance.asset_issuer === contract?.asset.issuer.key.publicKey
      ) !== undefined
    )
  }

  const accessWallet = (): void => {
    navigate(`${PathRoute.VAULT_DETAIL}/${profile?.vault_id}`)
  }

  const accessProfile = (): void => {
    navigate(`${PathRoute.PROFILE}`)
  }

  return (
    <Flex>
      <Sidebar highlightMenu={PathRoute.SOROBAN_SMART_CONTRACTS}>
        <ContractsDetailTemplate
          onSubmitWithdraw={onSubmitWithdraw}
          onSubmitDeposit={onSubmitDeposit}
          currentBalance={getCurrentBalance()}
          deposited={getDepositedValue()}
          hasAssetInVault={hasAssetInVault()}
          accessWallet={accessWallet}
          accessProfile={accessProfile}
          hasWallet={profile?.vault_id !== null}
          loading={loadingPosition}
          contract={contract}
          userAccount={profile?.vault?.wallet?.key.publicKey}
          isDepositing={isDepositing}
          isWithdrawing={isWithdrawing}
          contractData={contractData}
          history={history}
          userPermissions={userPermissions}
          currentInVault={currentInVault}
          timerCounter={timerCounter}
        />
      </Sidebar>
    </Flex>
  )
}
