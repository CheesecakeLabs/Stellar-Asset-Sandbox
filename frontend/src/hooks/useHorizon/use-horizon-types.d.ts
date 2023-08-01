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

    interface IHorizonContext {
      loadingHorizon: boolean
      getAssetData(
        assetCode: string,
        assetIssuer: string
      ): Promise<IAsset | undefined>
      assetData: IAsset | undefined
    }
  }
}
