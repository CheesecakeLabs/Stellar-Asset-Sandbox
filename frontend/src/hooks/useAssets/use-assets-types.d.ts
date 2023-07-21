declare namespace Hooks {
  namespace UseAssetsTypes {
    interface IAsset {
      id: number
      code: string
      name: string
      assetType: string
      issuer: Hooks.UseWalletsTypes.IWallet
      distributor: Hooks.UseWalletsTypes.IWallet
      supply: number
    }

    interface IAssetDto {
      id: number
      code: string
      name: string
      asset_type: string
      issuer: Hooks.UseWalletsTypes.IWallet
      distributor: Hooks.UseWalletsTypes.IWallet
      supply: number
    }

    interface IAssetRequest {
      amount?: number
      asset_type: number
      code: string
      limit?: number
      name: string
      set_flags?: string[]
      sponsor_id?: int
    }

    interface IMintRequest {
      id: string
      code: string
      sponsor_id: number
      amount: number
    }

    interface IBurnRequest {
      id: number
      sponsor_id: number
      code: string
      amount: number
    }

    interface IDistributeRequest {
      source_wallet_id: number
      destination_wallet_pk: number
      asset_id: number
      amount: number
      sponsor_id: number
    }

    interface IClawbackRequest {
      sponsor_id: number
      code: string
      amount: number
      from: string
    }

    interface IFreezeRequest {
      issuer: number
      code: string
      clear_flags: string[]
      trustor_pk: string
    }

    interface IAuthorizeRequest {
      trustor_pk: string,
      issuer: number,
      code: string,
      set_flags: string[]
    }

    interface IAssetsContext {
      loading: boolean
      mint: (params: IMintRequest) => Promise<boolean>
      burn: (params: IBurnRequest) => Promise<boolean>
      distribute: (params: IDistributeRequest) => Promise<boolean>
      authorize: (params: IAuthorizeRequest) => Promise<boolean>
      freeze: (params: IFreezeRequest) => Promise<boolean>
      clawback: (params: IClawbackRequest) => Promise<boolean>
      forge: (params: IAssetRequest) => Promise<boolean>
      getAssets: () => Promise<void>
      assets: IAssetDto[] | undefined
    }
  }
}
