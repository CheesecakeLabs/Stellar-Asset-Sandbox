/* eslint-disable @typescript-eslint/no-explicit-any */
import * as StellarSdk from '@stellar/stellar-sdk'
import { StellarPlus } from 'stellar-plus'
import { CertificateOfDepositClient } from 'stellar-plus/lib/stellar-plus/soroban/contracts/certificate-of-deposit'

import { I128, STELLAR_NETWORK, codWasmHash } from '../constants'
import { spec } from './constants'

const getContract = (contractId: string): CertificateOfDepositClient => {
  return new StellarPlus.Contracts.CertificateOfDeposit({
    network: STELLAR_NETWORK,
    spec: new StellarSdk.ContractSpec(spec),
    contractId: contractId,
    wasmHash: codWasmHash,
  })
}

const userTxInvocation = (sourcePk: string): any => {
  return {
    header: {
      source: sourcePk,
      timeout: 30,
    },
    signers: [sourcePk],
  }
}

const deposit = async (
  amount: I128,
  address: string,
  contractId: string,
  sourcePk: string
): Promise<any> => {
  const contract = getContract(contractId)

  await contract.deposit({
    address: address,
    amount: amount,
    ...userTxInvocation(sourcePk),
  })
}

const withdraw = async (
  address: string,
  accept_premature_withdraw: boolean,
  contractId: string
): Promise<any> => {
  const contract = getContract(contractId)

  await contract.withdraw({
    address: address,
    acceptPrematureWithdraw: accept_premature_withdraw,
  })
}

const getEstimatedYield = async (
  address: string,
  contractId: string
): Promise<any> => {
  const contract = getContract(contractId)
  return contract.getEstimatedYield({
    address: address,
  })
}

const getPosition = async (rawArgs: {
  address: string
  contractId: string
}): Promise<any> => {
  const contract = getContract(rawArgs.contractId)

  return contract.getPosition({
    address: rawArgs.address,
  })
}

const getEstimatedPrematureWithdraw = async (
  contractId: string,
  address: string
): Promise<any> => {
  const contract = getContract(contractId)
  return contract.getEstimatedPrematureWithdraw({
    address: address,
  })
}

const getTimeLeft = async (
  address: string,
  contractId: string
): Promise<any> => {
  const contract = getContract(contractId)
  return contract.getEstimatedPrematureWithdraw({
    address: address,
  })
}

export const certificateOfDepositClient = {
  deposit,
  withdraw,
  getEstimatedYield,
  getPosition,
  getEstimatedPrematureWithdraw,
  getTimeLeft,
}
