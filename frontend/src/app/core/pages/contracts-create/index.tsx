import { Flex, useToast } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { FieldValues, UseFormSetValue } from 'react-hook-form'

import { useAssets } from 'hooks/useAssets'
import { useContracts } from 'hooks/useContracts'
import { useHorizon } from 'hooks/useHorizon'
import { useTransactions } from 'hooks/useTransactions'
import { useVaults } from 'hooks/useVaults'
import { SorobanService } from 'soroban'
import { MessagesError } from 'utils/constants/messages-error'

import { PathRoute } from '../../../../components/enums/path-route'
import { Sidebar } from 'components/organisms/sidebar'
import { ContractsCreateTemplate } from 'components/templates/contracts-create'

export const ContractsCreate: React.FC = () => {
  const { loadingAssets, assets, getAssets } = useAssets()
  const { createContract, loading } = useContracts()
  const { vaults, getVaults, loadingVaults } = useVaults()
  const { getAccountData } = useHorizon()
  const toast = useToast()
  const { sign, submit } = useTransactions()

  const onSubmit = async (
    data: FieldValues,
    setValue: UseFormSetValue<FieldValues>,
    asset: Hooks.UseAssetsTypes.IAssetDto,
    vault: Hooks.UseVaultsTypes.IVault
  ): Promise<void> => {
    if (!asset) return

    try {
      const contract = {
        name: 'Contract',
        asset_id: asset.id.toString(),
        vault_id: vault.id.toString(),
        address: vault.wallet.key.publicKey,
        yield_rate: Number(data.yield_rate || 0),
        term: Number(data.term || 0),
        min_deposit: Number(data.min_deposit || 0),
        penalty_rate: Number(data.penalty_rate || 0),
      }

      const sourceAccount = await SorobanService.getSourceAccount(
        'GA7FLYHBEVVZK6NCR7I3Y352VW4D7UNALTIZF4GDLULHA3P2CH5LM56D'
      )

      const operation = SorobanService.getContractOperation({
        assetCode: asset.code,
        assetIssuerPk: asset.issuer.key.publicKey,
      })

      const preppedTx = await SorobanService.wrapClassicAsset(
        operation,
        sourceAccount
      )

      const signedEnvelope = await sign({ envelope: preppedTx })
      if (signedEnvelope) {
        const resultEnvelope = await submit({ envelope: signedEnvelope })

        if (resultEnvelope) {
          await SorobanService.submitSoroban(resultEnvelope)
        }
      }
      return
      const contractCreated = await createContract(contract)

      if (contractCreated) {
        setValue('yield_rate', '')
        setValue('term', '')
        setValue('min_deposit', '')
        setValue('penalty_rate', '')
        toast({
          title: 'Contract created!',
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
