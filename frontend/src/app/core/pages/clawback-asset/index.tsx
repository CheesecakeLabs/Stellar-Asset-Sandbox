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
import { ClawbackAssetTemplate } from 'components/templates/clawback-asset'

export const ClawbackAsset: React.FC = () => {
  const { clawback, loading } = useAssets()
  const toast = useToast()
  const location = useLocation()
  const asset = location.state

  const onSubmit = async (
    data: FieldValues,
    setValue: UseFormSetValue<FieldValues>
  ): Promise<void> => {
    try {
      const isSuccess = await clawback({
        sponsor_id: 1,
        amount: data.amount,
        code: asset.code,
        from: data.from,
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

  return (
    <Flex>
      <Sidebar highlightMenu={PathRoute.HOME}>
        <Flex flexDir="row" w="full" justifyContent="center" gap="1.5rem">
          <Flex maxW="584px" flexDir="column" w="full">
            <Text fontSize="2xl" fontWeight="400" h="3.5rem">
              Asset Management
            </Text>
            <ClawbackAssetTemplate
              onSubmit={onSubmit}
              loading={loading}
              asset={asset}
            />
          </Flex>
          <MenuActionsAsset action={AssetActions.CLAWBACK} asset={asset} />
        </Flex>
      </Sidebar>
    </Flex>
  )
}
