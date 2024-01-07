import { Flex, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { FieldValues, UseFormSetValue } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { useAssets } from 'hooks/useAssets'
import { useAuth } from 'hooks/useAuth'
import { havePermission } from 'utils'
import { MessagesError } from 'utils/constants/messages-error'
import { toBase64 } from 'utils/converter'
import { GAService } from 'utils/ga'

import { PathRoute } from '../../../../components/enums/path-route'
import { Permissions } from 'components/enums/permissions'
import { Sidebar } from 'components/organisms/sidebar'
import { ForgeAssetTemplate } from 'components/templates/forge-asset'

export const ForgeAsset: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { forge, loadingOperation } = useAssets()
  const { userPermissions, loadingUserPermissions, getUserPermissions } =
    useAuth()
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
        set_flags: data.control_mechanisms || [],
        image: selectedFile ? await toBase64(selectedFile) : null,
      }
      const assetForged = await forge(asset)

      if (assetForged) {
        setValue('amount', '')
        toast({
          title: 'Forge success!',
          description: `You created ${data.code}`,
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: 'top-right',
        })
        GAService.GAEvent('forge_asset_success')
        navigate(`${PathRoute.ASSET_HOME}/${assetForged.id}`)
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
    getUserPermissions().then(() => {
      if (
        !loadingUserPermissions &&
        !havePermission(Permissions.CREATE_ASSET, userPermissions)
      ) {
        navigate(PathRoute.HOME)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    GAService.GAEvent('forge_asset_form_start')
  }, [])

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
      <Sidebar highlightMenu={PathRoute.TOKEN_MANAGEMENT}>
        <ForgeAssetTemplate
          onSubmit={onSubmit}
          loading={loadingOperation}
          setSelectedFile={setSelectedFile}
          selectedFile={selectedFile}
        />
      </Sidebar>
    </Flex>
  )
}
