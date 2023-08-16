import { Flex, useToast } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { FieldValues, UseFormSetValue } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { useAssets } from 'hooks/useAssets'
import { useVaults } from 'hooks/useVaults'
import { MessagesError } from 'utils/constants/messages-error'

import { PathRoute } from '../../../../components/enums/path-route'
import { Sidebar } from 'components/organisms/sidebar'
import { ContractsCreateTemplate } from 'components/templates/contracts-create'

export const ContractsCreate: React.FC = () => {
  const { forge, loadingAssets, assets, getAssets } = useAssets()
  const { vaults, getVaults, loadingVaults } = useVaults()
  const toast = useToast()
  const navigate = useNavigate()

  const onSubmit = async (
    data: FieldValues,
    setValue: UseFormSetValue<FieldValues>,
  ): Promise<void> => {
    try {
      const asset = {
        name: data.name,
        code: data.code,
        amount: data.initial_supply,
        asset_type: data.asset_type,
        set_flags: data.control_mechanisms,
      }
      const assetForged = await forge(asset)

      if (assetForged) {
        setValue('amount', '')
        toast({
          title: 'Contract created!',
          description: `You created ${data.code}`,
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: 'top-right',
        })
        navigate(PathRoute.MINT_ASSET, { state: assetForged })
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
      title: 'New contract error!',
      description: message,
      status: 'error',
      duration: 9000,
      isClosable: true,
      position: 'top-right',
    })
  }

  useEffect(() => {
    getAssets()
  }, [getAssets])

  useEffect(() => {
    getVaults()
  }, [getVaults])

  return (
    <Flex>
      <Sidebar highlightMenu={PathRoute.SOROBAN_SMART_CONTRACTS}>
        <ContractsCreateTemplate
          onSubmit={onSubmit}
          loading={loadingAssets || loadingVaults}
          vaults={vaults}
          assets={assets}
        />
      </Sidebar>
    </Flex>
  )
}
