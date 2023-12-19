declare namespace Hooks {
  namespace UseDashboardsTypes {
    interface IAsset {
      asset: IAssetData
      amount: number[]
      quantity: number[]
      date: string[]
    }

    interface IAssetData {
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
      image: string
    }

    interface ITransaction {
      log_id: int
      user_id: int
      transaction_type_id: int
      asset: IAssetData
      date: string
      amount: number
      description: string
      origin_pk: string
      destination_pk: string
      current_supply: number
      current_main_vault: number
    }

    interface ISupply {
      current_main_vault: number[]
      current_supply: number[]
      date: string[]
    }

    interface IDashboardsContext {
      loadingChart: boolean
      loadingLastTransactions: boolean
      getPaymentsByAssetId(
        assetId: string,
        transactionId?: number,
        period?: TChartPeriod
      ): Promise<Hooks.UseDashboardsTypes.IAsset | undefined>
      getPayments(
        period?: TChartPeriod
      ): Promise<Hooks.UseDashboardsTypes.IAsset[] | undefined>
      getLastTransactions(
        transactionId: number
      ): Promise<Hooks.UseDashboardsTypes.ITransaction[] | undefined>
      getSupplyByAssetId(
        assetId: string,
        period?: TChartPeriod
      ): Promise<Hooks.UseDashboardsTypes.ISupply | undefined>
    }
  }
}
