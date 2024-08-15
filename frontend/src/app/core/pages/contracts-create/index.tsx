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
import { StellarPlusError } from 'stellar-plus/lib/stellar-plus/error'
import { ConveyorBeltErrorMeta } from 'stellar-plus/lib/stellar-plus/error/helpers/conveyor-belt'
import { CertificateOfDepositClient } from 'stellar-plus/lib/stellar-plus/soroban/contracts/certificate-of-deposit'
import { AutoRestorePlugin } from 'stellar-plus/lib/stellar-plus/utils/pipeline/plugins/simulate-transaction'

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

      const sponsorPK = await getSponsorPK()
      if (!sponsorPK) throw new Error('Invalid sponsor')

      const opex = ContractsService.loadAccount(sponsorPK)
      const opexTxInvocation = ContractsService.getTxInvocation(opex, BUMP_FEE)

      const token = ContractsService.loadToken(
        asset,
        ContractsService.getAutoRestorePlugin(opex)
      )
      let contractId = asset.contract_id

      if (!contractId) {
        await token.wrapAndDeploy(opexTxInvocation).catch(error => {
          console.error('Error wrapping and deploying token', error)
          console.log('Details', error as StellarPlusError)
          console.log('Meta', (error as StellarPlusError).meta)
          console.log(
            'Conveyor',
            (error as StellarPlusError).meta?.conveyorBeltErrorMeta
          )
          console.log(
            'Details',
            (error as StellarPlusError).meta?.sorobanSimulationData
          )
          throw new Error('Error wrapping and deploying token')
        })
        contractId = token.sorobanTokenHandler.getContractId()

        if (!contractId) throw new Error('Error creating contract id')
        await updateContractId(asset.id, contractId)
      }

      const codVault = ContractsService.loadAccount(vault.wallet.key.publicKey)
      const codTxInvocation = ContractsService.getTxInvocation(
        codVault,
        INNER_FEE
        /*{
          signers: [opex],
          header: {
            fee: BUMP_FEE,
            source: opex.getPublicKey(),
            timeout: 60,
          },
        }*/
      )

      const codClient = new CertificateOfDepositClient({
        networkConfig: STELLAR_NETWORK,
        contractParameters: {
          wasmHash: WASM_HASH,
        },
        options: {
          sorobanTransactionPipeline: {
            customRpcHandler: vcRpcHandler,
            plugins: [ContractsService.getAutoRestorePlugin(opex)],
          },
        },
        /* wasmHash: WASM_HASH,
        rpcHandler: vcRpcHandler,
        options: {
          restoreTxInvocation: opexTxInvocation,
        },*/
      })

      const codParams = await ContractsService.validateParamsCOD(
        vault,
        asset,
        token,
        data,
        compoundType,
        compound
      )

      await codClient.deploy(opexTxInvocation).catch(error => {
        console.error('Error deploying contract', error)
        console.log('Details', error as StellarPlusError)
        console.log('Meta', (error as StellarPlusError).meta)
        console.log(
          'Conveyor',
          (error as StellarPlusError).meta?.conveyorBeltErrorMeta
        )

        throw new Error('Error deploying contract')
      })
      await codClient
        .initialize({ ...codParams, ...codTxInvocation })
        .catch(error => {
          console.error('Error initializing contract', error)
          throw new Error('Error initializing contract')
        })

      const codContractId = codClient.getContractId()
      if (!codContractId) throw new Error('Invalid Contract ID')

      console.log('Contract ID:', codContractId)
      console.log('Asset ID:', asset.id)
      console.log('Vault ID:', vault.id)
      console.log('Yield Rate:', codParams.yieldRate)
      console.log('Term:', codParams.term)
      console.log('Min Deposit:', codParams.minDeposit)
      console.log('Penalty Rate:', codParams.penaltyRate)
      console.log('Compound:', codParams.compoundStep)
      console.log('Token TOKEN_DECIMALS:', TOKEN_DECIMALS)

      const contract = {
        name: 'Yield-bearing Asset',
        asset_id: asset.id.toString(),
        vault_id: vault.id.toString(),
        address: codContractId || '',
        yield_rate: Number(codParams.yieldRate),
        term: Number(codParams.term),
        min_deposit: Number(codParams.minDeposit) / TOKEN_DECIMALS,
        penalty_rate: Number(codParams.penaltyRate),
        compound: Number(codParams.compoundStep),
      }

      const contractCreated = await createContract(contract).catch(error => {
        console.error('Error creating contract', error)
        throw new Error('Error creating contract')
      })

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
      console.error(error)
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
