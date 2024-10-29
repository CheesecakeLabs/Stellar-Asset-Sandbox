import { xdr } from '@stellar/stellar-base'
import { AccountHandler } from 'stellar-plus/lib/stellar-plus/account'
import { SignatureSchema } from 'stellar-plus/lib/stellar-plus/account/account-handler/types'
import { AccountBase } from 'stellar-plus/lib/stellar-plus/account/base'
import { FeeBumpTransaction, Transaction, TransactionXdr } from 'stellar-plus/lib/stellar-plus/types'

export type CustomAccountHandler = {
  sign(
    tx: Transaction | FeeBumpTransaction,
    customSign: (
      tx: Transaction | FeeBumpTransaction,
      publicKey: string
    ) => Promise<TransactionXdr>
  ): Promise<TransactionXdr>
}

export type CustomAccountHandlerPayload = {
  customSign: (
    tx: Transaction | FeeBumpTransaction,
    publicKey: string
  ) => Promise<TransactionXdr>
  publicKey: string
}

export class CustomAccountHandlerClient
  extends AccountBase
  implements AccountHandler
{
  protected customSign: (
    tx: Transaction | FeeBumpTransaction,
    publicKey: string
  ) => Promise<TransactionXdr>
  protected publicKey: string

  constructor(payload: CustomAccountHandlerPayload) {
    const customSign = payload.customSign as (
      tx: Transaction | FeeBumpTransaction,
      publicKey: string
    ) => Promise<TransactionXdr>
    const publicKey = payload.publicKey as string
    try {
      super({ ...payload })
      this.customSign = customSign
      this.publicKey = publicKey
    } catch (e) {
      throw new Error('error load public key')
    }
  }
  signSorobanAuthEntry(entry: xdr.SorobanAuthorizationEntry, validUntilLedgerSeq: number, networkPassphrase: string): Promise<xdr.SorobanAuthorizationEntry> {
    throw new Error('Method not implemented.')
  }
  signatureSchema?: SignatureSchema | undefined

  public getPublicKey(): string {
    try {
      return this.publicKey
    } catch (e) {
      throw new Error('error load public key')
    }
  }

  public async sign(
    tx: Transaction | FeeBumpTransaction
  ): Promise<TransactionXdr> {
    try {
      return (await this.customSign(tx, this.publicKey)) as TransactionXdr
    } catch (e) {
      throw new Error('Error signing transaction')
    }
  }
}

