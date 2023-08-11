import { Flex, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { FieldValues, UseFormSetValue } from 'react-hook-form'
import { useParams } from 'react-router-dom'

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
  const [payments, setPayments] = useState<Hooks.UseHorizonTypes.IPayment[]>()
  const toast = useToast()

  const { id } = useParams()
  const { loadingAssets, loadingOperation, assets, getAssets, distribute } =
    useAssets()
  const { loadingVault, loadingVaults, getVaults, getVaultById } = useVaults()
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

  const toastError = (message: string): void => {
    toast({
      title: 'Distribute error!',
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
    if (id) {
      getVaultById(id).then(vault => setVault(vault))
    }
  }, [getVaultById, id, setVault])

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
          onSubmit={onSubmit}
          loadingAssets={loadingAssets}
          loadingOperation={loadingOperation}
          loadingVaults={loadingVault || loadingVaults}
          assets={assets}
          vaults={vaults}
          payments={payments}
          setSelectedAsset={setSelectedAsset}
          selectedAsset={selectedAsset}
          loadingHorizon={loadingHorizon}
        />
      </Sidebar>
    </Flex>
  )
}
