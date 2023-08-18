import { Flex, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { FieldValues, UseFormSetValue } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'

import { useAssets } from 'hooks/useAssets'
import { useHorizon } from 'hooks/useHorizon'
import { useVaults } from 'hooks/useVaults'
import { MessagesError } from 'utils/constants/messages-error'

import { PathRoute } from 'components/enums/path-route'
import { Sidebar } from 'components/organisms/sidebar'
import { VaultDetailTemplate } from 'components/templates/vault-detail'

export const VaultDetail: React.FC = () => {
  const [vault, setVault] = useState<Hooks.UseVaultsTypes.IVault>()
  const [vaults, setVaults] = useState<Hooks.UseVaultsTypes.IVault[]>()
  const [vaultCategories, setVaultCategories] =
    useState<Hooks.UseVaultsTypes.IVaultCategory[]>()
  const [payments, setPayments] = useState<Hooks.UseHorizonTypes.IPayment[]>()
  const toast = useToast()
  const navigate = useNavigate()

  const { id } = useParams()
  const { loadingAssets, loadingOperation, assets, getAssets, distribute } =
    useAssets()
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
  const { loadingHorizon, getPaymentsData } = useHorizon()

  const [selectedAsset, setSelectedAsset] =
    useState<Hooks.UseAssetsTypes.IAssetDto>()

  const onSubmit = async (
    data: FieldValues,
    setValue: UseFormSetValue<FieldValues>,
    wallet: string | undefined
  ): Promise<void> => {
    try {
      if (!selectedAsset) return

      const isSuccess = await distribute({
        source_wallet_id: vault?.wallet.id,
        destination_wallet_pk: wallet ? wallet : data.destination_wallet_id,
        asset_id: selectedAsset.id.toString(),
        sponsor_id: 1,
        amount: data.amount,
      })

      if (isSuccess) {
        setValue('destination_wallet_id', '')
        setValue('amount', '')

        toast({
          title: 'Distribute success!',
          description: `You distributed ${data.amount} ${selectedAsset.code}`,
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: 'top-right',
        })

        if (vault) {
          getPaymentsData(vault.wallet.key.publicKey)
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
          getPaymentsData(vault.wallet.key.publicKey)
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
  ): Promise<void> => {
    try {
      if (!vault) return

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

  useEffect(() => {
    getVaults().then(vaults => setVaults(vaults))
    getAssets()
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
          onSubmit={onSubmit}
          setSelectedAsset={setSelectedAsset}
          createVaultCategory={createVaultCategory}
          onUpdateVault={onUpdateVault}
          onUpdateVaultAssets={onUpdateVaultAssets}
          onDeleteVault={onDeleteVault}
        />
      </Sidebar>
    </Flex>
  )
}
