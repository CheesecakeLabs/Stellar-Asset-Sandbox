import { AccountHandler } from 'stellar-plus/lib/stellar-plus/account'
import { AccountBaseClient } from 'stellar-plus/lib/stellar-plus/account/base'
import { AccountHelpersPayload } from 'stellar-plus/lib/stellar-plus/account/helpers/types'
import { FeeBumpTransaction, Transaction, TransactionXdr } from 'stellar-plus/lib/stellar-plus/types'

export type AccountHandlerPayload = AccountHelpersPayload

export type CustomAccountHandler = {
  sign(
    tx: Transaction | FeeBumpTransaction,
    customSign: (
      tx: Transaction | FeeBumpTransaction,
      publicKey: string
    ) => Promise<TransactionXdr>
  ): Promise<TransactionXdr>
}

export type CustomAccountHandlerPayload = AccountHandlerPayload & {
  customSign: (
    tx: Transaction | FeeBumpTransaction,
    publicKey: string
  ) => Promise<TransactionXdr>
  publicKey: string
}

export class CustomAccountHandlerClient
  extends AccountBaseClient
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
      throw new Error('error sign')
    }
  }
}

