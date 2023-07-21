import { Flex, useToast } from '@chakra-ui/react'
import React from 'react'
import { FieldValues, UseFormSetValue } from 'react-hook-form'

import { useAssets } from 'hooks/useAssets'
import { MessagesError } from 'utils/constants/messages-error'
import { mockupAssets } from 'utils/mockups'

import { AssetHeader } from 'components/atoms'
import { AssetActions } from 'components/enums/asset-actions'
import { MenuActionsAsset } from 'components/organisms/menu-actions-asset'
import { Sidebar } from 'components/organisms/sidebar'
import { DistributeAssetTemplate } from 'components/templates/distribute-asset'
import {useLocation} from "react-router-dom";

export const DistributeAsset: React.FC = () => {
  const { distribute, loading } = useAssets()
  const toast = useToast()
  const location = useLocation();
  const asset = location.state;

  const onSubmit = async (
    data: FieldValues,
    setValue: UseFormSetValue<FieldValues>
  ): Promise<void> => {
    try {
      const isSuccess = await distribute({
        source_wallet_id: asset.issuer.id,
        destination_wallet_pk: data.destination_wallet_id,
        asset_id: asset.id.toString(),
        sponsor_id: 1,
        amount: data.amount,
      })

      if (isSuccess) {
        setValue('destination_wallet_id', '')
        setValue('amount', '')

        toast({
          title: 'Distribute success!',
          description: `You distributed ${data.amount} ${asset.code} to ${data.destination_wallet_id}`,
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

  return (
    <Flex>
      <Sidebar>
        <Flex flexDir="row" w="full" justifyContent="center" gap="1.5rem">
          <Flex maxW="584px" flexDir="column" w="full">
            <AssetHeader asset={asset} />
            <DistributeAssetTemplate onSubmit={onSubmit} loading={loading} />
          </Flex>
          <MenuActionsAsset action={AssetActions.DISTRIBUTE} asset={asset} />
        </Flex>
      </Sidebar>
    </Flex>
  )
}
