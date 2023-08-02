import { Flex, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { FieldValues, UseFormSetValue } from 'react-hook-form'
import { useLocation } from 'react-router-dom'

import { useAssets } from 'hooks/useAssets'
import { useHorizon } from 'hooks/useHorizon'
import { useVaults } from 'hooks/useVaults'
import { MessagesError } from 'utils/constants/messages-error'

import { PathRoute } from 'components/enums/path-route'
import { Sidebar } from 'components/organisms/sidebar'
import { VaultDetailTemplate } from 'components/templates/vault-detail'

export const VaultDetail: React.FC = () => {
  const location = useLocation()
  const toast = useToast()
  const vault = location.state as Hooks.UseVaultsTypes.IVault

  const { loading, assets, getAssets, distribute } = useAssets()
  const { vaults, getVaults } = useVaults()
  const { paymentsData, getPaymentsData } = useHorizon()

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
        source_wallet_id: vault.wallet.id,
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
          description: `You distributed ${data.amount} ${selectedAsset.code} to ${data.destination_wallet_id}`,
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
      title: 'Distribute error!',
      description: message,
      status: 'error',
      duration: 9000,
      isClosable: true,
      position: 'top-right',
    })
  }

  useEffect(() => {
    getVaults()
    getAssets()
    getPaymentsData(vault.wallet.key.publicKey)
  }, [getVaults, getAssets, getPaymentsData, vault.wallet.key.publicKey])

  return (
    <Flex>
      <Sidebar highlightMenu={PathRoute.VAULTS}>
        <VaultDetailTemplate
          vault={vault}
          onSubmit={onSubmit}
          loading={loading}
          assets={assets}
          vaults={vaults}
          payments={paymentsData}
          setSelectedAsset={setSelectedAsset}
          selectedAsset={selectedAsset}
        />
      </Sidebar>
    </Flex>
  )
}
