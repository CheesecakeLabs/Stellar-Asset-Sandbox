import { Flex, Skeleton, useToast, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { FieldValues, UseFormSetValue } from 'react-hook-form'
import { useParams } from 'react-router-dom'

import { useAssets } from 'hooks/useAssets'
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
  const [asset, setAsset] = useState<Hooks.UseAssetsTypes.IAssetDto>()
  const { clawback, getAssetById, loadingOperation, loadingAsset } = useAssets()
  const { id } = useParams()
  const { vaults, getVaults } = useVaults()
  const toast = useToast()

  const onSubmit = async (
    data: FieldValues,
    setValue: UseFormSetValue<FieldValues>,
    wallet: string | undefined
  ): Promise<void> => {
    if (!asset || !id) return
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
      getAssetById(id).then(asset => setAsset(asset))

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
    if (id) {
      getAssetById(id).then(asset => setAsset(asset))
    }
  }, [getAssetById, id])

  return (
    <Flex>
      <Sidebar highlightMenu={PathRoute.HOME}>
        <Flex flexDir="row" w="full" justifyContent="center" gap="1.5rem">
          <Flex maxW="966px" flexDir="column" w="full">
            <ManagementBreadcrumb title={'Clawback'} />
            {loadingAsset || !asset ? (
              <Skeleton h="15rem" />
            ) : (
              <ClawbackAssetTemplate
                onSubmit={onSubmit}
                loading={loadingOperation}
                asset={asset}
                vaults={vaults}
                assetData={asset.assetData}
              />
            )}
          </Flex>
          <VStack>
            <MenuActionsAsset action={AssetActions.CLAWBACK} />
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
