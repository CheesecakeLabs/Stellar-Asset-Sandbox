declare namespace Hooks {
  namespace UseDashboardsTypes {
    interface IAsset {
      asset: {
        id: number
        name: string
        code: string
        distributor: {
          id: number
          type: string
          key: {
            id: number
            publicKey: string
            weight: number
            walletId: number
          }
          funded: boolean
        }
        issuer: {
          id: number
          type: string
          key: {
            id: number
            publicKey: string
            weight: number
            walletId: number
          }
          funded: boolean
        }
        amount: number
        asset_type: string
      }
      amount: number[]
      quantity: number[]
      date: string[]
    }

    interface IDashboardsContext {
      loadingChart: boolean
      getPaymentsByAssetId(
        assetId: string
      ): Promise<Hooks.UseDashboardsTypes.IAsset | undefined>
      getPayments(): Promise<Hooks.UseDashboardsTypes.IAsset[] | undefined>
    }
  }
}
