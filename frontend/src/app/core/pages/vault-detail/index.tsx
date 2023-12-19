import { Flex, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { FieldValues, UseFormSetValue } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'

import { useAssets } from 'hooks/useAssets'
import { useAuth } from 'hooks/useAuth'
import { useHorizon } from 'hooks/useHorizon'
import { useVaults } from 'hooks/useVaults'
import { MessagesError } from 'utils/constants/messages-error'
import { toFixedCrypto } from 'utils/formatter'

import { PathRoute } from 'components/enums/path-route'
import { Sidebar } from 'components/organisms/sidebar'
import { VaultDetailTemplate } from 'components/templates/vault-detail'

export const VaultDetail: React.FC = () => {
  const [vault, setVault] = useState<Hooks.UseVaultsTypes.IVault>()
  const [vaults, setVaults] = useState<Hooks.UseVaultsTypes.IVault[]>()
  const [vaultsByAsset, setVaultsByAsset] =
    useState<Hooks.UseVaultsTypes.IVault[]>()
  const [vaultCategories, setVaultCategories] =
    useState<Hooks.UseVaultsTypes.IVaultCategory[]>()
  const [payments, setPayments] = useState<Hooks.UseHorizonTypes.IPayments>()
  const [historyNavPayments, setHistoryNavPayments] = useState<string[]>([])

  const toast = useToast()
  const navigate = useNavigate()

  const { id } = useParams()
  const {
    loadingAssets,
    loadingOperation,
    assets,
    getAssets,
    distribute,
    getAssetById,
  } = useAssets()
  const { loadingUserPermissions, userPermissions, getUserPermissions } =
    useAuth()
  const {
    loadingVault,
    loadingVaults,
    updatingVault,
    updatingVaultAssets,
    deletingVault,
    getVaults,
    getVaultById,
    getVaultCategories,
    createVaultCategory,
    updateVault,
    updateVaultAssets,
    deleteVault,
  } = useVaults()
  const { loadingHorizon, getPaymentsData, getAssetAccounts } = useHorizon()

  const [selectedAsset, setSelectedAsset] =
    useState<Hooks.UseAssetsTypes.IAssetDto>()

  const onSubmit = async (
    amount: string,
    setValue: UseFormSetValue<FieldValues>,
    wallet: string | undefined
  ): Promise<void> => {
    try {
      if (!selectedAsset || !wallet) return

      const assetData = await getAssetById(selectedAsset.id.toString())

      const isSuccess = await distribute({
        source_wallet_id: vault?.wallet.id,
        destination_wallet_pk: wallet,
        asset_id: selectedAsset.id.toString(),
        sponsor_id: 1,
        amount: toFixedCrypto(amount),
        current_supply: Number(assetData?.assetData?.amount || 0),
        current_main_vault:
          Number(assetData?.distributorBalance?.balance || 0) - Number(amount),
      })

      if (isSuccess) {
        setValue('destination_wallet_id', '')
        setValue('amount', '')

        toast({
          title: 'Distribute success!',
          description: `You distributed ${amount} ${selectedAsset.code}`,
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: 'top-right',
        })

        if (vault) {
          getPaymentsData(vault.wallet.key.publicKey).then(payments => {
            setPayments(payments)
          })
        }

        if (id) {
          getVaultById(id).then(vault => {
            setVault(vault)
          })
        }

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

  const onUpdateVault = async (
    params: Hooks.UseVaultsTypes.IVaultUpdateParams
  ): Promise<void> => {
    try {
      if (!vault) return

      const isSuccess = await updateVault(vault.id, params)

      if (isSuccess) {
        toast({
          title: 'Vault updated!',
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: 'top-right',
        })

        if (vault) {
          getPaymentsData(vault.wallet.key.publicKey).then(payments => {
            setPayments(payments)
          })
        }

        if (id) {
          getVaultById(id).then(vault => {
            setVault(vault)
          })
        }

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

  const onDeleteVault = async (): Promise<void> => {
    try {
      if (!vault) return

      const isSuccess = await deleteVault(vault.id)

      if (isSuccess) {
        toast({
          title: 'Vault deleted!',
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: 'top-right',
        })

        navigate(PathRoute.VAULTS)
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

  const onUpdateVaultAssets = async (
    listEdit: Hooks.UseHorizonTypes.IBalance[]
  ): Promise<boolean> => {
    try {
      if (!vault) return false

      const assetsRemoveds =
        vault.accountData?.balances
          .filter(
            balance =>
              !listEdit?.some(
                asset =>
                  asset.asset_code === balance.asset_code &&
                  asset.asset_issuer === balance.asset_issuer
              )
          )
          .map(asset => ({
            asset_code: asset.asset_code,
            asset_issuer_pk: asset.asset_issuer,
            is_add: false,
            is_remove: true,
          })) || []

      const assetsAdded =
        listEdit
          .filter(
            asset =>
              !vault.accountData?.balances?.some(
                balance =>
                  asset.asset_code === balance.asset_code &&
                  asset.asset_issuer === balance.asset_issuer
              )
          )
          .map(asset => ({
            asset_code: asset.asset_code,
            asset_issuer_pk: asset.asset_issuer,
            is_add: true,
            is_remove: false,
          })) || []

      const isSuccess = await updateVaultAssets(vault.id, [
        ...assetsRemoveds,
        ...assetsAdded,
      ])

      if (isSuccess) {
        toast({
          title: 'Vault assets updated!',
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: 'top-right',
        })

        setSelectedAsset(undefined)

        if (id) {
          getVaultById(id).then(vault => {
            setVault(vault)
          })
        }
        return isSuccess
      }

      toastError(MessagesError.errorOccurred)
      return false
    } catch (error) {
      let message
      if (error instanceof Error) message = error.message
      else message = String(error)
      toastError(message)
      return false
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

  useEffect(() => {
    getVaults().then(vaults => setVaults(vaults))
    getAssets(true)
  }, [getAssets, getVaults])

  useEffect(() => {
    getVaultCategories().then(vaultCategories =>
      setVaultCategories(vaultCategories)
    )
  }, [getVaultCategories])

  useEffect(() => {
    if (id) {
      getVaultById(id).then(vault => {
        setVault(vault)
        if (vault?.active === 0) {
          navigate(PathRoute.VAULTS)
        }
      })
    }
  }, [getVaultById, id, navigate, setVault])

  useEffect(() => {
    if (vault) {
      getPaymentsData(vault.wallet.key.publicKey).then(payments => {
        setPayments(payments)
      })
    }
  }, [getPaymentsData, vault])

  useEffect(() => {
    getUserPermissions()
  }, [getUserPermissions])

  const getPaymentsDataByLink = (action: 'prev' | 'next'): void => {
    const link =
      action === 'next'
        ? payments?._links.next.href
        : historyNavPayments[historyNavPayments.length - 1]
    if (link) {
      getPaymentsData(undefined, link).then(paymentsData => {
        if (action === 'prev') {
          setHistoryNavPayments(previous => previous.slice(0, -1))
        }
        if (action === 'next') {
          setHistoryNavPayments(previous => [
            ...previous,
            payments?._links.self.href || '',
          ])
        }
        setPayments(paymentsData)
      })
    }
  }

  const changeAsset = async (
    asset: Hooks.UseAssetsTypes.IAssetDto | undefined
  ): Promise<void> => {
    if (!asset) {
      setSelectedAsset(undefined)
      return
    }
    const assetAccounts = await getAssetAccounts(
      asset.code,
      asset.issuer.key.publicKey
    )
    const vaults = await getVaults(true)
    const filteredVaults =
      vaults
        ?.filter((vault: Hooks.UseVaultsTypes.IVault) =>
          assetAccounts
            ?.find(
              assetAccount => assetAccount.id === vault.wallet.key.publicKey
            )
            ?.balances.some(
              balance =>
                balance.asset_code === asset.code &&
                balance.asset_issuer === asset.issuer.key.publicKey
            )
        )
        .map(vault => ({
          ...vault,
          isUnauthorized:
            assetAccounts
              ?.find(
                assetAccount => assetAccount.id === vault.wallet.key.publicKey
              )
              ?.balances.find(
                balance =>
                  balance.asset_code === asset.code &&
                  balance.asset_issuer === asset.issuer.key.publicKey
              )?.is_authorized === false || false,
        })) || []
    setVaultsByAsset(filteredVaults)
    setSelectedAsset(asset)
  }

  return (
    <Flex>
      <Sidebar highlightMenu={PathRoute.VAULTS}>
        <VaultDetailTemplate
          vault={vault}
          loadingAssets={loadingAssets}
          loadingOperation={loadingOperation}
          loadingVaults={loadingVault || loadingVaults}
          assets={assets}
          vaults={vaults}
          payments={payments}
          selectedAsset={selectedAsset}
          loadingHorizon={loadingHorizon}
          vaultCategories={vaultCategories}
          updatingVault={updatingVault}
          updatingVaultAssets={updatingVaultAssets}
          deletingVault={deletingVault}
          isPrevDisabled={historyNavPayments.length === 0}
          loadingUserPermissions={loadingUserPermissions}
          userPermissions={userPermissions}
          vaultsByAsset={vaultsByAsset}
          onSubmit={onSubmit}
          createVaultCategory={createVaultCategory}
          onUpdateVault={onUpdateVault}
          onUpdateVaultAssets={onUpdateVaultAssets}
          onDeleteVault={onDeleteVault}
          getPaymentsDataByLink={getPaymentsDataByLink}
          changeAsset={changeAsset}
        />
      </Sidebar>
    </Flex>
  )
}
