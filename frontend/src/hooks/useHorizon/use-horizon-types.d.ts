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
      getAssetAccounts(
        assetCode: string,
        assetIssuer: string
      ): Promise<IAssetAccounts[] | undefined>
    }
  }
}
