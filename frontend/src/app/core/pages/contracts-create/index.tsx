import { Flex, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { FieldValues } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { useAssets } from 'hooks/useAssets'
import { useContracts } from 'hooks/useContracts'
import { useTransactions } from 'hooks/useTransactions'
import { useVaults } from 'hooks/useVaults'
import { STELLAR_NETWORK, WASM_HASH, vcRpcHandler } from 'soroban/constants'
import {
  BUMP_FEE,
  ContractsService,
  INNER_FEE,
  TOKEN_DECIMALS,
} from 'soroban/contracts-service'
import { StellarPlus } from 'stellar-plus'

import { PathRoute } from '../../../../components/enums/path-route'
import { Sidebar } from 'components/organisms/sidebar'
import { ContractsCreateTemplate } from 'components/templates/contracts-create'
import { TSelectCompoundType } from 'components/templates/contracts-create/components/select-compound-type'

export const ContractsCreate: React.FC = () => {
  const [creatingContract, setCreatingContract] = useState(false)

  const { loadingAssets, assets, getAssets, updateContractId } = useAssets()
  const { createContract } = useContracts()
  const { vaults, loadingVaults, getVaults } = useVaults()
  const { getSponsorPK } = useTransactions()

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

      const token = ContractsService.loadToken(asset)
      let contractId = asset.contract_id

      const sponsorPK = await getSponsorPK()
      if (!sponsorPK) throw new Error('Invalid sponsor')

      await ContractsService.validateContract(sponsorPK)

      const opex = ContractsService.loadAccount(sponsorPK)
      const opexTxInvocation = ContractsService.getTxInvocation(opex, BUMP_FEE)

      if (!contractId) {
        await token.wrapAndDeploy(opexTxInvocation)
        contractId = token.sorobanTokenHandler.getContractId()

        if (!contractId) throw new Error('Error creating contract id')
        await updateContractId(asset.id, contractId)
      }

      const codVault = ContractsService.loadAccount(vault.wallet.key.publicKey)
      const codTxInvocation = ContractsService.getTxInvocation(
        codVault,
        INNER_FEE
      )

      const codClient = new StellarPlus.Contracts.CertificateOfDeposit({
        network: STELLAR_NETWORK,
        wasmHash: WASM_HASH,
        rpcHandler: vcRpcHandler,
        options: {
          restoreTxInvocation: opexTxInvocation,
        },
      })

      const codParams = await ContractsService.validateParamsCOD(
        vault,
        asset,
        token,
        data,
        compoundType,
        compound
      )

      await codClient.deploy(opexTxInvocation)
      await codClient.initialize({ ...codParams, ...codTxInvocation })

      const codContractId = codClient.getContractId()
      if (!codContractId) throw new Error('Invalid Contract ID')

      const contract = {
        name: 'Yield-bearing Asset',
        asset_id: asset.id.toString(),
        vault_id: vault.id.toString(),
        address: codClient.getContractId() || '',
        yield_rate: Number(codParams.yieldRate),
        term: Number(codParams.term),
        min_deposit: Number(codParams.minDeposit) / TOKEN_DECIMALS,
        penalty_rate: Number(codParams.penaltyRate),
        compound: Number(codParams.compoundStep),
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
        navigate(`${PathRoute.CONTRACT_DETAIL}/${contractCreated.id}`)
        return
      }
    } catch (error) {
      let message
      if (error instanceof Error) message = error.message
      else message = String(error)
      toastError(message)
    } finally {
      setCreatingContract(false)
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
