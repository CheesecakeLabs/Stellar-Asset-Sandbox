import { Flex, useToast } from '@chakra-ui/react'
import React from 'react'
import { FieldValues, UseFormSetValue } from 'react-hook-form'

import { useAssets } from 'hooks/useAssets'
import { MessagesError } from 'utils/constants/messages-error'

import { AssetHeader } from 'components/atoms'
import { AssetActions } from 'components/enums/asset-actions'
import { MenuActionsAsset } from 'components/organisms/menu-actions-asset'
import { Sidebar } from 'components/organisms/sidebar'
import { MintAssetTemplate } from 'components/templates/mint-asset'
import { useLocation } from "react-router-dom";

export const MintAsset: React.FC = () => {
  const { mint, loading } = useAssets()
  const toast = useToast()
  const location = useLocation();
  const asset = location.state;

  const onSubmit = async (
    data: FieldValues,
    setValue: UseFormSetValue<FieldValues>
  ): Promise<void> => {
    try {
      const isSuccess = await mint({
        id: 1,
        code: asset.code,
        sponsor_id: asset.issuer.id,
        amount: data.amount,
      })

      if (isSuccess) {
        setValue('amount', '')
        toast({
          title: 'Mint success!',
          description: `You minted ${data.amount} ${asset.code}`,
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
      title: 'Mint error!',
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
            <MintAssetTemplate onSubmit={onSubmit} loading={loading} asset={asset} />
          </Flex>
          <MenuActionsAsset action={AssetActions.MINT} asset={asset} />
        </Flex>
      </Sidebar>
    </Flex>
  )
}
