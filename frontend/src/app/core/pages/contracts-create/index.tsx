import { Flex, useToast } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { FieldValues, UseFormSetValue } from 'react-hook-form'

import { useAssets } from 'hooks/useAssets'
import { useContracts } from 'hooks/useContracts'
import { useTransactions } from 'hooks/useTransactions'
import { useVaults } from 'hooks/useVaults'
import { SorobanService } from 'soroban'
import { deployerClient } from 'soroban/deployer'
import { codWasmHash } from 'soroban/deployer/constants'
import { MessagesError } from 'utils/constants/messages-error'

import { PathRoute } from '../../../../components/enums/path-route'
import { Sidebar } from 'components/organisms/sidebar'
import { ContractsCreateTemplate } from 'components/templates/contracts-create'

export const ContractsCreate: React.FC = () => {
  const { loadingAssets, assets, getAssets } = useAssets()
  const { createContract, loading } = useContracts()
  const { vaults, getVaults, loadingVaults } = useVaults()
  const toast = useToast()
  const { sign, submit, getSponsorPK } = useTransactions()

  const onSubmit = async (
    data: FieldValues,
    setValue: UseFormSetValue<FieldValues>,
    asset: Hooks.UseAssetsTypes.IAssetDto,
    vault: Hooks.UseVaultsTypes.IVault
  ): Promise<void> => {
    if (!asset) return

    try {
      const contractId = await SorobanService.getContractId({
        assetCode: asset.code,
        assetIssuerPk: asset.issuer.key.publicKey,
      })

      const contract = {
        name: 'Contract',
        asset_id: asset.id.toString(),
        vault_id: vault.id.toString(),
        address: contractId,
        yield_rate: Number(data.yield_rate || 0),
        term: Number(data.term || 0),
        min_deposit: Number(data.min_deposit || 0),
        penalty_rate: Number(data.penalty_rate || 0),
      }

      const sponsorPK = await getSponsorPK()
      if (!sponsorPK) {
        throw new Error('Invalid sponsor!')
      }

      const sourceAccount = await SorobanService.getSourceAccount(sponsorPK)

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

      await deployerClient.deploy({
        deployer: vault.wallet.key.publicKey,
        wasm_hash: codWasmHash,
        salt: '22',
        admin: vault.wallet.key.publicKey,
        asset: contractId,
        term: BigInt(contract.term),
        compound_step: BigInt(0),
        yield_rate: BigInt(contract.yield_rate),
        min_deposit: BigInt(contract.min_deposit),
        penalty_rate: BigInt(contract.penalty_rate),
        signerSecret: vault.wallet.key.publicKey,
      })

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
          creatingContract={loading}
        />
      </Sidebar>
    </Flex>
  )
}
