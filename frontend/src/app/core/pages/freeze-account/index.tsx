import { Flex, useToast } from '@chakra-ui/react'
import React from 'react'
import { FieldValues, UseFormSetValue } from 'react-hook-form'

import { useAssets } from 'hooks/useAssets'
import { MessagesError } from 'utils/constants/messages-error'
import { mockupAssets } from 'utils/mockups'

import { AssetHeader } from 'components/atoms'
import { AssetActions } from 'components/enums/asset-actions'
import { MenuActionsAsset } from 'components/organisms/menu-actions-asset'
import { Sidebar } from 'components/organisms/sidebar'
import { FreezeAccountTemplate } from 'components/templates/freeze-account'
import {useLocation} from "react-router-dom";

export const FreezeAccount: React.FC = () => {
  const { freeze, loading } = useAssets()
  const toast = useToast()
  const location = useLocation();
  const asset = location.state;

  const onSubmit = async (
    data: FieldValues,
    setValue: UseFormSetValue<FieldValues>
  ): Promise<void> => {
    try {
      const isSuccess = await freeze({
        clear_flags: ['auth_revocable_flag'],
        code: asset.code,
        issuer_id: asset.issuer.id,
        order: 1,
        trustor_id: data.trustor_id,
      })

      if (isSuccess) {
        setValue('trustor_id', '')

        toast({
          title: 'Freeze success!',
          description: `You freezed ${data.trustor_id}`,
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
      title: 'Freeze error!',
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
            <FreezeAccountTemplate onSubmit={onSubmit} loading={loading} />
          </Flex>
          <MenuActionsAsset action={AssetActions.FREEZE} asset={asset} />
        </Flex>
      </Sidebar>
    </Flex>
  )
}