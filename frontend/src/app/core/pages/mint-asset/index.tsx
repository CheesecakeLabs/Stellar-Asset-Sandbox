import { Flex, Skeleton, useToast, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { FieldValues, UseFormSetValue } from 'react-hook-form'
import { useParams } from 'react-router-dom'

import { useAssets } from 'hooks/useAssets'
import { mintHelper } from 'utils/constants/helpers'
import { MessagesError } from 'utils/constants/messages-error'

import { AssetActions } from 'components/enums/asset-actions'
import { PathRoute } from 'components/enums/path-route'
import { ActionHelper } from 'components/molecules/action-helper'
import { ManagementBreadcrumb } from 'components/molecules/management-breadcrumb'
import { MenuActionsAsset } from 'components/organisms/menu-actions-asset'
import { Sidebar } from 'components/organisms/sidebar'
import { MintAssetTemplate } from 'components/templates/mint-asset'

export const MintAsset: React.FC = () => {
  const [asset, setAsset] = useState<Hooks.UseAssetsTypes.IAssetDto>()
  const { mint, getAssetById, loadingOperation, loadingAsset } = useAssets()
  const { id } = useParams()
  const toast = useToast()

  const onSubmit = async (
    data: FieldValues,
    setValue: UseFormSetValue<FieldValues>
  ): Promise<void> => {
    if (!asset || !id) return

    try {
      const isSuccess = await mint({
        id: asset.id.toString(),
        code: asset.code,
        sponsor_id: 1,
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
        getAssetById(id).then(asset => setAsset(asset))
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
    if (id) {
      getAssetById(id).then(asset => setAsset(asset))
    }
  }, [getAssetById, id])

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
      <Sidebar highlightMenu={PathRoute.HOME}>
        <Flex flexDir="row" w="full" justifyContent="center" gap="1.5rem">
          <Flex maxW="584px" flexDir="column" w="full">
            <ManagementBreadcrumb title={'Mint'} />
            {(loadingAsset && !asset) || !asset ? (
              <Skeleton h="15rem" />
            ) : (
              <MintAssetTemplate
                onSubmit={onSubmit}
                loading={loadingOperation}
                asset={asset}
                assetData={asset.assetData}
              />
            )}
          </Flex>
          <VStack>
            <MenuActionsAsset action={AssetActions.MINT} />
            <ActionHelper title={'About Mint'} description={mintHelper} />
          </VStack>
        </Flex>
      </Sidebar>
    </Flex>
  )
}
