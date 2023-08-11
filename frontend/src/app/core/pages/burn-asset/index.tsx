import { Flex, useToast, VStack } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { FieldValues, UseFormSetValue } from 'react-hook-form'
import { useLocation } from 'react-router-dom'

import { useAssets } from 'hooks/useAssets'
import { useHorizon } from 'hooks/useHorizon'
import { burnHelper } from 'utils/constants/helpers'
import { MessagesError } from 'utils/constants/messages-error'

import { AssetActions } from 'components/enums/asset-actions'
import { PathRoute } from 'components/enums/path-route'
import { ActionHelper } from 'components/molecules/action-helper'
import { ManagementBreadcrumb } from 'components/molecules/management-breadcrumb'
import { MenuActionsAsset } from 'components/organisms/menu-actions-asset'
import { Sidebar } from 'components/organisms/sidebar'
import { BurnAssetTemplate } from 'components/templates/burn-asset'

export const BurnAsset: React.FC = () => {
  const { burn, loadingOperation } = useAssets()
  const { getAssetData, assetData } = useHorizon()

  const toast = useToast()
  const location = useLocation()
  const asset = location.state

  const onSubmit = async (
    data: FieldValues,
    setValue: UseFormSetValue<FieldValues>
  ): Promise<void> => {
    try {
      const isSuccess = await burn({
        id: asset.id.toString(),
        code: asset.code,
        sponsor_id: 1,
        amount: data.amount,
      })

      if (isSuccess) {
        setValue('amount', '')
        toast({
          title: 'Burn success!',
          description: `You burned ${data.amount} ${asset.code}`,
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: 'top-right',
        })
        getAssetData(asset.code, asset.issuer.key.publicKey)
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

  useEffect(() => {
    getAssetData(asset.code, asset.issuer.key.publicKey)
  }, [asset.code, asset.issuer.key.publicKey, getAssetData])

  const toastError = (message: string): void => {
    toast({
      title: 'Burn error!',
      description: message,
      status: 'error',
      duration: 9000,
      isClosable: true,
      position: 'top-right',
    })
  }

  return (
    <Flex>
      <Sidebar highlightMenu={PathRoute.HOME}>
        <Flex flexDir="row" w="full" justifyContent="center" gap="1.5rem">
          <Flex maxW="584px" flexDir="column" w="full">
            <ManagementBreadcrumb title={'Burn'} />
            <BurnAssetTemplate
              onSubmit={onSubmit}
              loading={loadingOperation}
              asset={asset}
              assetData={assetData}
            />
          </Flex>
          <VStack>
            <MenuActionsAsset action={AssetActions.BURN} asset={asset} />
            <ActionHelper title={'About Burn'} description={burnHelper} />
          </VStack>
        </Flex>
      </Sidebar>
    </Flex>
  )
}
