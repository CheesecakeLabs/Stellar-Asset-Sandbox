import { Flex, useToast, VStack } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { FieldValues, UseFormSetValue } from 'react-hook-form'
import { useLocation } from 'react-router-dom'

import { useAssets } from 'hooks/useAssets'
import { useHorizon } from 'hooks/useHorizon'
import { useVaults } from 'hooks/useVaults'
import { clawbackHelper } from 'utils/constants/helpers'
import { MessagesError } from 'utils/constants/messages-error'

import { AssetActions } from 'components/enums/asset-actions'
import { PathRoute } from 'components/enums/path-route'
import { ActionHelper } from 'components/molecules/action-helper'
import { ManagementBreadcrumb } from 'components/molecules/management-breadcrumb'
import { MenuActionsAsset } from 'components/organisms/menu-actions-asset'
import { Sidebar } from 'components/organisms/sidebar'
import { ClawbackAssetTemplate } from 'components/templates/clawback-asset'

export const ClawbackAsset: React.FC = () => {
  const { clawback, loading } = useAssets()
  const { vaults, getVaults } = useVaults()
  const { getAssetData, assetData } = useHorizon()
  const toast = useToast()
  const location = useLocation()
  const asset = location.state

  const onSubmit = async (
    data: FieldValues,
    setValue: UseFormSetValue<FieldValues>,
    wallet: string | undefined
  ): Promise<void> => {
    try {
      const isSuccess = await clawback({
        sponsor_id: 1,
        amount: data.amount,
        code: asset.code,
        from: wallet ? wallet : data.from,
      })

      if (isSuccess) {
        setValue('from', '')
        setValue('amount', '')

        toast({
          title: 'Clawback success!',
          description: `You Clawbacked ${data.amount} ${asset.code} from ${data.from}`,
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: 'top-right',
        })
        return
      }
      getAssetData(asset.code, asset.issuer.key.publicKey)

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
      title: 'Clawback error!',
      description: message,
      status: 'error',
      duration: 9000,
      isClosable: true,
      position: 'top-right',
    })
  }

  useEffect(() => {
    getVaults()
  }, [getVaults])

  useEffect(() => {
    getAssetData(asset.code, asset.issuer.key.publicKey)
  }, [asset.code, asset.issuer.key.publicKey, getAssetData])

  return (
    <Flex>
      <Sidebar highlightMenu={PathRoute.HOME}>
        <Flex flexDir="row" w="full" justifyContent="center" gap="1.5rem">
          <Flex maxW="584px" flexDir="column" w="full">
            <ManagementBreadcrumb title={'Clawback'} />
            <ClawbackAssetTemplate
              onSubmit={onSubmit}
              loading={loading}
              asset={asset}
              vaults={vaults}
              assetData={assetData}
            />
          </Flex>
          <VStack>
            <MenuActionsAsset action={AssetActions.CLAWBACK} asset={asset} />
            <ActionHelper
              title={'About Clawback'}
              description={clawbackHelper}
            />
          </VStack>
        </Flex>
      </Sidebar>
    </Flex>
  )
}
