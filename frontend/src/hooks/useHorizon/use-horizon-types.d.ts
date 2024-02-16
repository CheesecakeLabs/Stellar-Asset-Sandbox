declare namespace Hooks {
  namespace UseHorizonTypes {
    interface IAsset {
      _links: {
        toml: {
          href: string
        }
      }
      asset_type: string
      asset_code: string
      asset_issuer: string
      paging_token: string
      num_accounts: number
      num_claimable_balances: number
      num_liquidity_pools: number
      amount: string
      accounts: {
        authorized: number
        authorized_to_maintain_liabilities: number
        unauthorized: number
      }
      claimable_balances_amount: string
      liquidity_pools_amount: string
      balances: {
        authorized: string
        authorized_to_maintain_liabilities: string
        unauthorized: string
      }
      flags: {
        auth_required: boolean
        auth_revocable: boolean
        auth_immutable: boolean
        auth_clawback_enabled: boolean
      }
    }

    interface IAccount {
      id: string
      account_id: string
      sequence: string
      sequence_ledger: number
      sequence_time: string
      subentry_count: number
      last_modified_ledger: number
      last_modified_time: string
      thresholds: {
        low_threshold: number
        med_threshold: number
        high_threshold: number
      }
      flags: {
        auth_required: boolean
        auth_revocable: boolean
        auth_immutable: boolean
        auth_clawback_enabled: boolean
      }
      balances: IBalance[]
      signers: {
        weight: number
        key: string
        type: string
      }[]
      num_sponsoring: number
      num_sponsored: number
      paging_token: string
    }

    interface IPayments {
      _embedded: {
        records: IPaymentItem[]
      }
      _links: {
        next: {
          href: string
          results: number
        }
        prev: {
          href: string
          results: number
        }
        self: {
          href: string
        }
      }
    }

    interface IEffects {
      _embedded: {
        records: IEffectItem[]
      }
      _links: {
        next: {
          href: string
          results: number
        }
        prev: {
          href: string
          results: number
        }
        self: {
          href: string
        }
      }
    }

    interface IOperationTrustline {
      id: string
      paging_token: string
      transaction_successful: boolean
      source_account: string
      type: string
      type_i: number
      created_at: string
      transaction_hash: string
      asset_type: string
      asset_code: string
      asset_issuer: string
      limit: string
      trustee: string
      trustor: string
    }

    interface IOperationTrustline {
      id: string
      paging_token: string
      transaction_successful: boolean
      source_account: string
      type: string
      type_i: number
      created_at: string
      transaction_hash: string
      asset_type: string
      asset_code: string
      asset_issuer: string
      limit: string
      trustee: string
      trustor: string
    }

    interface IOperationPayment {
      id: string
      paging_token: string
      transaction_successful: boolean
      source_account: string
      type: string
      type_i: number
      created_at: string
      transaction_hash: string
      asset_type: string
      asset_code: string
      asset_issuer: string
      from: string
      to: string
      amount: string
    }

    interface IPaymentItem {
      id: string
      paging_token: string
      transaction_successful: true
      source_account: string
      type: string
      type_i: number
      created_at: string
      transaction_hash: string
      asset_type: string
      asset_code: string
      asset_issuer: string
      from: string
      to: string
      amount: string
    }

    interface IEffectItem {
      id: string
      account: string
      type: string
      created_at: string
      asset_type: string
      asset_code: string
      asset_issuer: string
      amount: string
      operation: IOperationPayment | IOperationTrustline | undefined
    }

    interface IBalance {
      balance: string
      limit?: string
      buying_liabilities?: string
      selling_liabilities?: string
      last_modified_ledger?: number
      is_authorized: boolean
      is_authorized_to_maintain_liabilities?: true
      asset_type?: string
      asset_code: string
      asset_issuer: string
    }

    interface IAssetAccounts {
      id: 'GA5276GSBII4DNJGEQYFLY3ANIOC7MGYNANFKOAJTG3CSXUYNQIGCSHT'
      balances: IBalance[]
    }

    interface IHolder {
      name: string
      amount: number
      percentage: number
    }

    interface ITransactionItem {
      id: string
      successful: true
      hash: string
      ledger: number
      created_at: string
      source_account: string
      fee_account: string
      fee_charged: string
      max_fee: string
      operation_count: number
      valid_after: string
      valid_before: string
      fee_bump_transaction: {
        hash: string
        signatures: string[]
      }
      inner_transaction: {
        hash: string
        signatures: string[]
        max_fee: string
      }
      effects?: IEffects
    }

    interface ITransactions {
      _embedded: {
        records: ITransactionItem[]
      }
      _links: {
        next: {
          href: string
          results: number
        }
        prev: {
          href: string
          results: number
        }
        self: {
          href: string
        }
      }
    }

    interface IHorizonContext {
      loadingHorizon: boolean
      assetData: IAsset | undefined
      accountData: IAccount | undefined
      getAssetData(
        assetCode: string,
        assetIssuer: string
      ): Promise<IAsset | undefined>
      getAccountData(wallet: string): Promise<IAccount | undefined>
      getPaymentsData(
        wallet?: string,
        link?: string
      ): Promise<IPayments | undefined>
      getAccountEffects(
        wallet?: string,
        link?: string
      ): Promise<IEffects | undefined>
      getAssetAccounts(
        assetCode: string,
        assetIssuer: string
      ): Promise<IAssetAccounts[] | undefined>
      getLatestSequenceLedger(): Promise<number | undefined>
      getTransactions(
        wallet?: string,
        link?: string
      ): Promise<ITransactions | undefined>
      getAccount(wallet: string): Promise<IAccount | undefined>
    }
  }
}
