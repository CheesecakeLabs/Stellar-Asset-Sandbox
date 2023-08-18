import { Flex, Skeleton, useToast, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { FieldValues, UseFormSetValue } from 'react-hook-form'
import { useParams } from 'react-router-dom'

import { useAssets } from 'hooks/useAssets'
import { useVaults } from 'hooks/useVaults'
import { freezeHelper } from 'utils/constants/helpers'
import { MessagesError } from 'utils/constants/messages-error'

import { AssetActions } from 'components/enums/asset-actions'
import { PathRoute } from 'components/enums/path-route'
import { ActionHelper } from 'components/molecules/action-helper'
import { ManagementBreadcrumb } from 'components/molecules/management-breadcrumb'
import { MenuActionsAsset } from 'components/organisms/menu-actions-asset'
import { Sidebar } from 'components/organisms/sidebar'
import { FreezeAccountTemplate } from 'components/templates/freeze-account'

export const FreezeAccount: React.FC = () => {
  const [asset, setAsset] = useState<Hooks.UseAssetsTypes.IAssetDto>()
  const { updateAuthFlags, getAssetById, loadingOperation, loadingAsset } =
    useAssets()
  const { id } = useParams()
  const { vaults, getVaults } = useVaults()
  const toast = useToast()

  const onSubmit = async (
    data: FieldValues,
    clearFlags: string[],
    setFlags: string[],
    setValue: UseFormSetValue<FieldValues>,
    wallet: string | undefined
  ): Promise<void> => {
    if (!asset || !id) return

    try {
      const isSuccess = await updateAuthFlags({
        trustor_pk: wallet ? wallet : data.trustor_pk,
        issuer: asset.issuer.id,
        code: asset.code,
        clear_flags: clearFlags,
        set_flags: setFlags,
      })

      if (isSuccess) {
        setValue('trustor_id', '')

        toast({
          title: 'Success!',
          description: `You ${
            clearFlags.length > 0 ? 'freezed' : 'unfreezed'
          } ${data.trustor_pk}`,
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
          <Flex maxW="584px" flexDir="column" w="full">
            <ManagementBreadcrumb title={'Freeze'} />
            {(loadingAsset && !asset) || !asset ? (
              <Skeleton h="15rem" />
            ) : (
              <FreezeAccountTemplate
                onSubmit={onSubmit}
                loading={loadingOperation}
                asset={asset}
                vaults={vaults}
              />
            )}
          </Flex>
          <VStack>
            <MenuActionsAsset action={AssetActions.FREEZE} />
            <ActionHelper title={'About Freeze'} description={freezeHelper} />
          </VStack>
        </Flex>
      </Sidebar>
    </Flex>
  )
}
