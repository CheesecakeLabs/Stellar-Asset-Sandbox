import { Flex, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { FieldValues, UseFormSetValue } from 'react-hook-form'

import { useAssets } from 'hooks/useAssets'
import { useContracts } from 'hooks/useContracts'
import { useTransactions } from 'hooks/useTransactions'
import { useVaults } from 'hooks/useVaults'
import { SorobanService } from 'soroban'
import { deployerClient } from 'soroban/deployer'
import { allowancePeriod, codSalt, codWasmHash } from 'soroban/deployer/constants'
import { MessagesError } from 'utils/constants/messages-error'

import { PathRoute } from '../../../../components/enums/path-route'
import { Sidebar } from 'components/organisms/sidebar'
import { ContractsCreateTemplate } from 'components/templates/contracts-create'
import { TSelectCompoundType } from 'components/templates/contracts-create/components/select-compound-type'
import { useNavigate } from 'react-router-dom'
import { useHorizon } from 'hooks/useHorizon'

export const ContractsCreate: React.FC = () => {
  const [creatingContract, setCreatingContract] = useState(false)
  const { loadingAssets, assets, getAssets, updateContractId } = useAssets()
  const { createContract } = useContracts()
  const { vaults, loadingVaults, getVaults } = useVaults()
  const { sign, submit, getSponsorPK } = useTransactions()
  const { getLatestSequenceLedger } = useHorizon()
  const toast = useToast()
  const navigate = useNavigate()

  const onSubmit = async (
    data: FieldValues,
    asset: Hooks.UseAssetsTypes.IAssetDto,
    vault: Hooks.UseVaultsTypes.IVault,
    compoundType: TSelectCompoundType,
    compound: number
  ): Promise<void> => {
    if (!asset) return

    try {
      setCreatingContract(true)

      const contractId = asset.contract_id ? asset.contract_id :
        SorobanService.getContractId({
          assetCode: asset.code,
          assetIssuerPk: asset.issuer.key.publicKey,
        })

      await updateContractId(asset.id, contractId)
      const termToSeconds = Number(data.term || 0) * 86400

      const contract = {
        name: 'Contract',
        asset_id: asset.id.toString(),
        vault_id: vault.id.toString(),
        address: contractId,
        yield_rate: Number(data.yield_rate || 0),
        term: termToSeconds,
        min_deposit: Number(data.min_deposit || 0),
        penalty_rate: Number(data.penalty_rate || 0),
        compound: compoundType === 'Compound interest' ? compound : 0
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

      const signedTransaction = await sign({ envelope: preppedTx })
      if (signedTransaction) {
        const resultEnvelope = await submit({ envelope: signedTransaction.envelope })

        if (resultEnvelope) {
          await SorobanService.submitSoroban(resultEnvelope)
        }
      }

      const latestSequenceLedger = await getLatestSequenceLedger()

      if (!latestSequenceLedger) {
        throw new Error('Invalid latest sequence ledger!')
      }

      await deployerClient.deploy({
        wasm_hash: codWasmHash,
        salt: codSalt,
        admin: vault.wallet.key.publicKey,
        asset: contractId,
        term: BigInt(contract.term),
        compound_step: BigInt(compoundType === 'Compound interest' ? compound : 0),
        yield_rate: BigInt(contract.yield_rate),
        min_deposit: BigInt(contract.min_deposit),
        penalty_rate: BigInt(contract.penalty_rate),
        allowance_period: latestSequenceLedger + allowancePeriod,
        signerSecret: vault.wallet.key.publicKey,
      })

      const contractCreated = await createContract(contract)

      if (contractCreated) {
        toast({
          title: 'Contract created!',
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: 'top-right',
        })
        navigate(`${PathRoute.CONTRACT_DETAIL}/${contractCreated.id}`)
        return
      }
      setCreatingContract(false)
      toastError(MessagesError.errorOccurred)
    } catch (error) {
      setCreatingContract(false)
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
          creatingContract={creatingContract}
        />
      </Sidebar>
    </Flex>
  )
}
