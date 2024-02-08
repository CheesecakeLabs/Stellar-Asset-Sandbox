import { Flex, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAssets } from 'hooks/useAssets'
import { useVaults } from 'hooks/useVaults'
import { MessagesError } from 'utils/constants/messages-error'
import { GAService } from 'utils/ga'

import { PathRoute } from 'components/enums/path-route'
import { Sidebar } from 'components/organisms/sidebar'
import { VaultCreateTemplate } from 'components/templates/vault-create'

export const VaultCreate: React.FC = () => {
  const {
    creatingVault,
    createVault,
    getVaultCategories,
    createVaultCategory,
  } = useVaults()
  const { assets, getAssets } = useAssets()
  const [vaultCategories, setVaultCategories] =
    useState<Hooks.UseVaultsTypes.IVaultCategory[]>()
  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    GAService.GAPageView('Vault Create')
    GAService.GAEvent('create_vault_form_start')
  }, [])

  const onSubmit = async (
    name: string,
    vaultCategoryId: number,
    assetsId: number[]
  ): Promise<void> => {
    try {
      const vault = {
        name: name,
        vault_category_id: vaultCategoryId,
        assets_id: assetsId,
      }
      const vaultCreated = await createVault(vault)

      if (vaultCreated) {
        toast({
          title: 'Success!',
          description: `You created ${name}`,
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: 'top-right',
        })
        GAService.GAEvent('create_vault_success')
        navigate(PathRoute.VAULTS)
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
    getVaultCategories().then(vaultCategories =>
      setVaultCategories(vaultCategories)
    )
    getAssets(true)
  }, [getAssets, getVaultCategories])

  const toastError = (message: string): void => {
    toast({
      title: 'Create vault error!',
      description: message,
      status: 'error',
      duration: 9000,
      isClosable: true,
      position: 'top-right',
    })
  }

  return (
    <Flex>
      <Sidebar highlightMenu={PathRoute.VAULTS}>
        <VaultCreateTemplate
          onSubmit={onSubmit}
          loading={creatingVault}
          vaultCategories={vaultCategories}
          createVaultCategory={createVaultCategory}
          assets={assets}
        />
      </Sidebar>
    </Flex>
  )
}
