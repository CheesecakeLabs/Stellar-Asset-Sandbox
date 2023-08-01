import { Flex, useToast, Text } from '@chakra-ui/react'
import React from 'react'
import { FieldValues, UseFormSetValue } from 'react-hook-form'
import { useLocation } from 'react-router-dom'

import { useAssets } from 'hooks/useAssets'
import { MessagesError } from 'utils/constants/messages-error'

import { AssetActions } from 'components/enums/asset-actions'
import { PathRoute } from 'components/enums/path-route'
import { MenuActionsAsset } from 'components/organisms/menu-actions-asset'
import { Sidebar } from 'components/organisms/sidebar'
import { FreezeAccountTemplate } from 'components/templates/freeze-account'

export const FreezeAccount: React.FC = () => {
  const { updateAuthFlags, loading } = useAssets()
  const toast = useToast()
  const location = useLocation()
  const asset = location.state

  const onSubmit = async (
    data: FieldValues,
    clearFlags: string[],
    setFlags: string[],
    setValue: UseFormSetValue<FieldValues>
  ): Promise<void> => {
    try {
      const isSuccess = await updateAuthFlags({
        trustor_pk: data.trustor_pk,
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

  return (
    <Flex>
      <Sidebar highlightMenu={PathRoute.HOME}>
        <Flex flexDir="row" w="full" justifyContent="center" gap="1.5rem">
          <Flex maxW="584px" flexDir="column" w="full">
            <Text fontSize="2xl" fontWeight="400" h="3.5rem">
              Asset Management
            </Text>
            <FreezeAccountTemplate
              onSubmit={onSubmit}
              loading={loading}
              asset={asset}
            />
          </Flex>
          <MenuActionsAsset action={AssetActions.FREEZE} asset={asset} />
        </Flex>
      </Sidebar>
    </Flex>
  )
}
