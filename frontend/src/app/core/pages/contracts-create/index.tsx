import { Flex, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { FieldValues } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { useAssets } from 'hooks/useAssets'
import { useContracts } from 'hooks/useContracts'
import { useHorizon } from 'hooks/useHorizon'
import { useTransactions } from 'hooks/useTransactions'
import { useVaults } from 'hooks/useVaults'
import { SorobanService } from 'soroban'
import * as SorobanClient from 'soroban-client'
import { sorobanConfig } from 'soroban/constants'
import { deployerClient } from 'soroban/deployer'
import {
  allowancePeriod,
  codSalt,
  codWasmHash,
} from 'soroban/deployer/constants'
import { MessagesError } from 'utils/constants/messages-error'
import { GAService } from 'utils/ga'

import { PathRoute } from '../../../../components/enums/path-route'
import { Sidebar } from 'components/organisms/sidebar'
import { ContractsCreateTemplate } from 'components/templates/contracts-create'
import { TSelectCompoundType } from 'components/templates/contracts-create/components/select-compound-type'

export const ContractsCreate: React.FC = () => {
  const [creatingContract, setCreatingContract] = useState(false)
  const [isGeneratedContractId, setGeneratedContractId] = useState(false)

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
    if (!asset) {
      throw new Error('Invalid asset')
    }
    try {
      setCreatingContract(true)

      const contractId = asset.contract_id
        ? asset.contract_id
        : SorobanService.getContractId({
            assetCode: asset.code,
            assetIssuerPk: asset.issuer.key.publicKey,
          })

      if (!asset.contract_id) {
        await updateContractId(asset.id, contractId)
      }

      const termToSeconds = Number(data.term || 0) * 86400
      const yieldRate = Number(data.yield_rate || 0) * 100
      const penaltyRate = Number(data.penalty_rate || 0) * 100

      const sponsorPK = await getSponsorPK()
      if (!sponsorPK) {
        throw new Error('Invalid sponsor!')
      }

      const sourceAccount = await SorobanService.getSourceAccount(sponsorPK)

      const operation = SorobanService.getContractOperation({
        assetCode: asset.code,
        assetIssuerPk: asset.issuer.key.publicKey,
      })

      if (!asset.contract_id && !isGeneratedContractId) {
        const preppedTx = await SorobanService.wrapClassicAsset(
          operation,
          sourceAccount
        )

        const signedTransaction = await sign({ envelope: preppedTx })
        if (signedTransaction) {
          const resultEnvelope = await submit({
            envelope: signedTransaction.envelope,
          })

          if (resultEnvelope) {
            const transaction = new SorobanClient.Transaction(
              resultEnvelope,
              sorobanConfig.network.passphrase
            )
            await SorobanService.submitSoroban(transaction)
          }
        }
        setGeneratedContractId(true)
      }

      const latestSequenceLedger = await getLatestSequenceLedger()

      if (!latestSequenceLedger) {
        throw new Error('Invalid latest sequence ledger!')
      }

      const transactionResult = await deployerClient.deploy({
        wasm_hash: codWasmHash,
        salt: codSalt(),
        admin: vault.wallet.key.publicKey,
        asset: contractId,
        term: BigInt(termToSeconds),
        compound_step: BigInt(
          compoundType === 'Compound interest' ? compound : 0
        ),
        yield_rate: BigInt(yieldRate),
        min_deposit: BigInt(Number(data.min_deposit || 0) * 10000000),
        penalty_rate: BigInt(penaltyRate),
        allowance_period: latestSequenceLedger + allowancePeriod,
        signerSecret: vault.wallet.key.publicKey,
      })

      if (transactionResult.status === 'SUCCESS') {
        const transactionSuccess =
          transactionResult as SorobanClient.SorobanRpc.GetSuccessfulTransactionResponse

        const xdr = transactionSuccess.returnValue?.toXDR('base64')
        if (!xdr) {
          throw new Error('Invalid transaction XDR')
        }

        const scVal = SorobanClient.xdr.ScVal.fromXDR(xdr, 'base64')
        const contractAddress =
          SorobanClient.Address.fromScVal(scVal).toString()

        const contract = {
          name: 'Contract',
          asset_id: asset.id.toString(),
          vault_id: vault.id.toString(),
          address: contractAddress,
          yield_rate: yieldRate,
          term: termToSeconds,
          min_deposit: Number(data.min_deposit || 0),
          penalty_rate: penaltyRate,
          compound: compoundType === 'Compound interest' ? compound : 0,
        }

        const contractCreated = await createContract(contract)

        if (contractCreated) {
          toast({
            title: 'Contract created!',
            status: 'success',
            duration: 9000,
            isClosable: true,
            position: 'top-right',
          })
          GAService.GAEvent('cd_form_success')
          navigate(`${PathRoute.CONTRACT_DETAIL}/${contractCreated.id}`)
          return
        }
      } else {
        toastError(MessagesError.errorOccurred)
      }

      setCreatingContract(false)
    } catch (error) {
      setCreatingContract(false)
      let message
      if (error instanceof Error) message = error.message
      else message = String(error)
      toastError(message)
    }
  }

  useEffect(() => {
    GAService.GAEvent('cd_form_start')
  }, [])

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
    getAssets(true)
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
