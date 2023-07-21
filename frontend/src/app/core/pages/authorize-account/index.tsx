import { Flex, useToast } from '@chakra-ui/react'
import React from 'react'
import { FieldValues, UseFormSetValue } from 'react-hook-form'

import { useAssets } from 'hooks/useAssets'
import { MessagesError } from 'utils/constants/messages-error'
import { mockupAssets } from 'utils/mockups'

import { AssetActions } from 'components/enums/asset-actions'
import { MenuActionsAsset } from 'components/organisms/menu-actions-asset'
import { Sidebar } from 'components/organisms/sidebar'
import { AuthorizeAccountTemplate } from 'components/templates/authorize-account'
import { AssetHeader } from 'components/atoms'
import {useLocation} from "react-router-dom";

export const AuthorizeAccount: React.FC = () => {
  const { authorize, loading } = useAssets()
  const toast = useToast()
  const location = useLocation();
  const asset = location.state;

  const onSubmit = async (
    data: FieldValues,
    setValue: UseFormSetValue<FieldValues>
  ): Promise<void> => {
    try {
      const isSuccess = await authorize({
        trustor_pk: data.wallet,
        issuer: asset.issuer.id,
        code: asset.code,
        set_flags: ["TRUST_LINE_AUTHORIZED"]
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

  return (
    <Flex>
      <Sidebar>
        <Flex flexDir="row" w="full" justifyContent="center" gap="1.5rem">
          <Flex maxW="584px" flexDir="column" w="full">
            <AssetHeader asset={asset} />
            <AuthorizeAccountTemplate onSubmit={onSubmit} loading={loading} />
          </Flex>
          <MenuActionsAsset action={AssetActions.AUTHORIZE} asset={asset}/>
        </Flex>
      </Sidebar>
    </Flex>
  )
}
