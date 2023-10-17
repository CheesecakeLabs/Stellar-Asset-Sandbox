import { Flex, Skeleton, useToast, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { FieldValues, UseFormSetValue } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'

import { useAssets } from 'hooks/useAssets'
import { useAuth } from 'hooks/useAuth'
import { havePermission } from 'utils'
import { mintHelper } from 'utils/constants/helpers'
import { MessagesError } from 'utils/constants/messages-error'

import { AssetActions } from 'components/enums/asset-actions'
import { PathRoute } from 'components/enums/path-route'
import { Permissions } from 'components/enums/permissions'
import { ActionHelper } from 'components/molecules/action-helper'
import { ManagementBreadcrumb } from 'components/molecules/management-breadcrumb'
import { MenuActionsAsset } from 'components/organisms/menu-actions-asset'
import { Sidebar } from 'components/organisms/sidebar'
import { PublishInformationTemplate } from 'components/templates/publish-information'

export const PublishInformation: React.FC = () => {
  const [asset, setAsset] = useState<Hooks.UseAssetsTypes.IAssetDto>()
  const [tomlData, setTomlData] = useState<Hooks.UseAssetsTypes.ITomlFile>()

  const {
    generateToml,
    getTomlData,
    getAssetById,
    loadingOperation,
    loadingAsset,
  } = useAssets()
  const { loadingUserPermissions, userPermissions, getUserPermissions } =
    useAuth()
  const { id } = useParams()
  const toast = useToast()
  const navigate = useNavigate()

  const onSubmit = async (
    data: FieldValues,
    setValue: UseFormSetValue<FieldValues>,
    isAssetAnchored: boolean
  ): Promise<void> => {
    try {
      const isSuccess = await generateToml({
        currencies: [
          {
            code: asset?.code,
            issuer: asset?.issuer.key.publicKey,
            desc: data.desc,
            image: data.image,
            is_asset_anchored: isAssetAnchored,
            anchor_asset_type: isAssetAnchored ? data.anchor_asset_type : null,
            anchor_asset: isAssetAnchored ? data.anchor_asset : null,
            attestation_of_reserve: data.attestation_of_reserve,
          },
        ],
      })

      if (isSuccess) {
        setValue('amount', '')
        toast({
          title: 'Information published!',
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

  useEffect(() => {
    if (id) {
      getAssetById(id).then(asset => setAsset(asset))
    }
  }, [getAssetById, id])

  useEffect(() => {
    getTomlData().then(toml => setTomlData(toml))
  }, [getTomlData])

  useEffect(() => {
    getUserPermissions().then((): void => {
      if (
        !loadingUserPermissions &&
        !havePermission(Permissions.FREEZE_ACCOUNT, userPermissions)
      ) {
        navigate(PathRoute.HOME)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
      <Sidebar highlightMenu={PathRoute.TOKEN_MANAGEMENT}>
        <Flex flexDir="row" w="full" justifyContent="center" gap="1.5rem">
          <Flex maxW="966px" flexDir="column" w="full">
            <ManagementBreadcrumb title={'Publish information'} />
            {(loadingAsset && !asset) || !asset ? (
              <Skeleton h="15rem" />
            ) : (
              <PublishInformationTemplate
                onSubmit={onSubmit}
                loading={loadingOperation}
                asset={asset}
                tomlData={tomlData}
              />
            )}
          </Flex>
          <VStack>
            {(userPermissions || !loadingUserPermissions) && (
              <MenuActionsAsset
                action={AssetActions.PUBLISH_INFORMATION}
                permissions={userPermissions}
              />
            )}
            <ActionHelper
              title={'About Publish Information'}
              description={mintHelper}
            />
          </VStack>
        </Flex>
      </Sidebar>
    </Flex>
  )
}
