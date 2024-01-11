import { Flex, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { FieldValues } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { FeeBumpTransaction, Transaction } from '@stellar/stellar-sdk'
import { Buffer } from 'buffer'
import { useAssets } from 'hooks/useAssets'
import { useContracts } from 'hooks/useContracts'
import { useTransactions } from 'hooks/useTransactions'
import { useVaults } from 'hooks/useVaults'
import { STELLAR_NETWORK, codWasmHash, vcRpcHandler } from 'soroban/constants'
import { StellarPlus } from 'stellar-plus'
import { TransactionXdr } from 'stellar-plus/lib/stellar-plus/types'

import { PathRoute } from '../../../../components/enums/path-route'
import { Sidebar } from 'components/organisms/sidebar'
import { ContractsCreateTemplate } from 'components/templates/contracts-create'
import { TSelectCompoundType } from 'components/templates/contracts-create/components/select-compound-type'

export const ContractsCreate: React.FC = () => {
  const [creatingContract, setCreatingContract] = useState(false)

  const { loadingAssets, assets, getAssets, updateContractId } = useAssets()
  const { createContract } = useContracts()
  const { vaults, loadingVaults, getVaults } = useVaults()
  const { sign, getSponsorPK } = useTransactions()

  const toast = useToast()
  const navigate = useNavigate()

  const customSign = async (
    tx: Transaction | FeeBumpTransaction,
    publicKey: string
  ): Promise<TransactionXdr> => {
    const signedTransaction = await sign({
      envelope: tx.toXDR(),
      wallet_pk: publicKey,
    })
    return signedTransaction?.envelope || ''
  }

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

      const token = new StellarPlus.Asset.SACHandler({
        code: asset.code,
        issuerPublicKey: asset.issuer.key.publicKey,
        network: STELLAR_NETWORK,
      })

      let contractId = asset.contract_id

      const termToSeconds = Number(data.term || 0) * 86400
      const yieldRate = Number(data.yield_rate || 0) * 100
      const penaltyRate = Number(data.penalty_rate || 0) * 100

      const sponsorPK = await getSponsorPK()
      if (!sponsorPK) {
        throw new Error('Invalid sponsor!')
      }

      const opex = new StellarPlus.Account.CustomAccountHandler({
        STELLAR_NETWORK,
        customSign: customSign,
        publicKey: sponsorPK,
      })

      const opexTxInvocation = {
        header: {
          source: opex.getPublicKey(),
          fee: '10000000', //1 XLM as maximum fee
          timeout: 30,
        },
        signers: [opex],
      }

      if (!contractId) {
        await token.wrapAndDeploy(opexTxInvocation)
        contractId = token.sorobanTokenHandler.getContractId()

        if (!contractId) {
          throw new Error('Error creating contract id')
        }

        await updateContractId(asset.id, contractId)
      }

      const codVault = new StellarPlus.Account.CustomAccountHandler({
        STELLAR_NETWORK,
        customSign: customSign,
        publicKey: vault.wallet.key.publicKey,
      })

      const codTxInvocation = {
        header: {
          source: vault.wallet.key.publicKey,
          fee: '1000000', //0.1 XLM as maximum fee
          timeout: 30,
        },
        signers: [codVault],
        feeBump: opexTxInvocation,
      }

      const codClient = new StellarPlus.Contracts.CertificateOfDeposit({
        network: STELLAR_NETWORK,
        wasmHash: codWasmHash,
        contractId: contractId,
      })
      await codClient.deploy(codTxInvocation)

      const sorobanHandler = new StellarPlus.SorobanHandler(STELLAR_NETWORK)
      const expirationLedger =
        (await sorobanHandler.server.getLatestLedger()).sequence + 200000

      const codParams = {
        admin: vault.wallet.key.publicKey,
        asset: asset.contract_id
          ? asset.contract_id
          : token.sorobanTokenHandler.getContractId(),
        term: BigInt(termToSeconds),
        compoundStep: BigInt(
          compoundType === 'Compound interest' ? compound : 0
        ),
        yieldRate: BigInt(yieldRate),
        minDeposit: BigInt(Number(data.min_deposit || 0) * 10000000),
        penaltyRate: BigInt(penaltyRate),
        allowancePeriod: expirationLedger,
      }

      await codClient.initialize({ ...codParams, ...codTxInvocation })

      const contract = {
        name: 'Contract',
        asset_id: asset.id.toString(),
        vault_id: vault.id.toString(),
        address: token.sorobanTokenHandler.getContractId() || '',
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
        navigate(`${PathRoute.CONTRACT_DETAIL}/${contractCreated.id}`)
        return
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
