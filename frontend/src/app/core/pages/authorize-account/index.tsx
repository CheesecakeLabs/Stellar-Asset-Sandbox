import { Flex, useToast, VStack } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { FieldValues, UseFormSetValue } from 'react-hook-form'
import { useLocation } from 'react-router-dom'

import { useAssets } from 'hooks/useAssets'
import { useVaults } from 'hooks/useVaults'
import { authorizeHelper } from 'utils/constants/helpers'
import { MessagesError } from 'utils/constants/messages-error'

import { AssetActions } from 'components/enums/asset-actions'
import { PathRoute } from 'components/enums/path-route'
import { ActionHelper } from 'components/molecules/action-helper'
import { ManagementBreadcrumb } from 'components/molecules/management-breadcrumb'
import { MenuActionsAsset } from 'components/organisms/menu-actions-asset'
import { Sidebar } from 'components/organisms/sidebar'
import { AuthorizeAccountTemplate } from 'components/templates/authorize-account'

export const AuthorizeAccount: React.FC = () => {
  const { authorize, loading } = useAssets()
  const { vaults, getVaults } = useVaults()
  const toast = useToast()
  const location = useLocation()
  const asset = location.state

  const onSubmit = async (
    data: FieldValues,
    setValue: UseFormSetValue<FieldValues>,
    wallet: string | undefined
  ): Promise<void> => {
    try {
      const isSuccess = await authorize({
        trustor_pk: wallet ? wallet : data.wallet,
        issuer: asset.issuer.id,
        code: asset.code,
        set_flags: ['TRUST_LINE_AUTHORIZED'],
      })

      if (isSuccess) {
        setValue('wallet', '')
        toast({
          title: 'Authorize success!',
          description: `You authorized ${data.wallet}`,
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
      title: 'Authorize error!',
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

  return (
    <Flex>
      <Sidebar highlightMenu={PathRoute.HOME}>
        <Flex flexDir="row" w="full" justifyContent="center" gap="1.5rem">
          <Flex maxW="584px" flexDir="column" w="full">
            <ManagementBreadcrumb title={'Authorize'} />
            <AuthorizeAccountTemplate
              onSubmit={onSubmit}
              loading={loading}
              asset={asset}
              vaults={vaults}
            />
          </Flex>
          <VStack>
            <MenuActionsAsset action={AssetActions.AUTHORIZE} asset={asset} />
            <ActionHelper
              title={'About Authorize'}
              description={authorizeHelper}
            />
          </VStack>
        </Flex>
      </Sidebar>
    </Flex>
  )
}
