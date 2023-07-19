import { Flex, useToast } from '@chakra-ui/react'
import React from 'react'
import { FieldValues, UseFormSetValue } from 'react-hook-form'

import { useAssets } from 'hooks/useAssets'
import { MessagesError } from 'utils/constants/messages-error'

import { Sidebar } from 'components/organisms/sidebar'
import { ForgeAssetTemplate } from 'components/templates/forge-asset'
import {PathRoute} from "../../../../components/enums/path-route";
import {useNavigate} from "react-router-dom";

export const ForgeAsset: React.FC = () => {
  const { forge, loading } = useAssets()
  const toast = useToast()
  const navigate = useNavigate()

  const onSubmit = async (
    data: FieldValues,
    setValue: UseFormSetValue<FieldValues>
  ): Promise<void> => {
    try {
      const asset = {
        name: data.name,
        code: data.code,
        amount: data.initial_supply,
        asset_type: data.asset_type,
        set_flags: data.control_mechanisms,
      }
      const isSuccess = await forge(asset)

      if (isSuccess) {
        setValue('amount', '')
        toast({
          title: 'Forge success!',
          description: `You created ${data.code}`,
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: 'top-right',
        })
        navigate(PathRoute.MINT_ASSET, {state : asset})
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
      title: 'Forge error!',
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
        <ForgeAssetTemplate onSubmit={onSubmit}
              loading={loading}/>
      </Sidebar>
    </Flex>
  )
}
