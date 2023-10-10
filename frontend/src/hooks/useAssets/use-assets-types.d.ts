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
      assetData: Hooks.UseHorizonTypes.IAsset | undefined
    }

    interface IAssetDto {
      id: number
      code: string
      name: string
      asset_type: string
      issuer: Hooks.UseWalletsTypes.IWallet
      distributor: Hooks.UseWalletsTypes.IWallet
      distributorBalance: Hooks.UseHorizonTypes.IBalance | undefined
      supply: number
      assetData: Hooks.UseHorizonTypes.IAsset | undefined
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
      amount: string
      current_supply: number
      current_main_vault: number
    }

    interface IBurnRequest {
      id: string
      sponsor_id: number
      code: string
      amount: string
      current_supply: number
      current_main_vault: number
    }

    interface IDistributeRequest {
      source_wallet_id: number
      destination_wallet_pk: string
      asset_id: string
      amount: string
      sponsor_id: number
      current_supply: number
      current_main_vault: number
    }

    interface IClawbackRequest {
      sponsor_id: number
      code: string
      amount: string
      from: string
      current_supply: number
      current_main_vault: number
    }

    interface IUpdateAuthFlagsRequest {
      issuer: number
      code: string
      clear_flags: string[]
      trustor_pk: string
      set_flags: string[]
    }

    interface IAuthorizeRequest {
      trustor_pk: string
      issuer: number
      code: string
      set_flags: string[]
    }

    interface IAssetsContext {
      loadingOperation: boolean
      loadingAssets: boolean
      loadingAsset: boolean
      assets: IAssetDto[] | undefined
      mint: (params: IMintRequest) => Promise<boolean>
      burn: (params: IBurnRequest) => Promise<boolean>
      distribute: (params: IDistributeRequest) => Promise<boolean>
      authorize: (params: IAuthorizeRequest) => Promise<boolean>
      updateAuthFlags: (params: IFreezeRequest) => Promise<boolean>
      clawback: (params: IClawbackRequest) => Promise<boolean>
      forge: (params: IAssetRequest) => Promise<IAsset | undefined>
      getAssets: () => Promise<void>
      getAssetById: (id: string) => Promise<IAssetDto | undefined>
    }
  }
}
