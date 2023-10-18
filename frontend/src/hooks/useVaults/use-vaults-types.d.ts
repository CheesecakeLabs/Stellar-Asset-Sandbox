declare namespace Hooks {
  namespace UseVaultsTypes {
    interface IVault {
      id: number
      name: string
      vault_category: IVaultCategory
      wallet: Hooks.UseWalletsTypes.IWallet
      accountData: Hooks.UseHorizonTypes.IAccount | undefined
      active: 0 | 1
      isUnauthorized?: boolean
    }

    interface IVaultRequest {
      name: string
      vault_category_id: number
      assets_id: number[]
    }

    interface IVaultCategory {
      id: number
      name: string
      theme: string
    }

    interface IVaultCategoryRequest {
      name: string
      theme?: string
    }

    interface IVaultUpdateParams {
      name: string
      vault_category_id: number
    }

    interface IVaultAssetsUpdateParams {
      asset_code: string
      asset_issuer_pk: string
      is_add: boolean
      is_remove: boolean
    }

    interface IVaultAccountName {
      name: string
      isAuthorized: boolean
    }

    interface IVaultsContext {
      loadingVault: boolean
      loadingVaults: boolean
      loadingVaultCategories: boolean
      creatingVault: boolean
      creatingVaultCategory: boolean
      vaults: IVault[] | undefined
      updatingVault: boolean
      updatingVaultAssets: boolean
      deletingVault: boolean
      getVaults: () => Promise<IVaults[] | undefined>
      getVaultCategories: () => Promise<IVaultCategory[] | undefined>
      createVault: (vault: IVaultRequest) => Promise<IVault | undefined>
      createVaultCategory: (
        vaultCategory: IVaultCategoryRequest
      ) => Promise<IVaultCategory | undefined>
      getVaultById: (id: string) => Promise<IVault | undefined>
      updateVault: (id: number, params: IVaultUpdateParams) => Promise<boolean>
      updateVaultAssets: (
        id: number,
        params: IVaultAssetsUpdateParams[]
      ) => Promise<boolean>
      deleteVault: (id: number) => Promise<boolean>
      filterVaultsByStatus: (
        vaults: Hooks.UseVaultsTypes.IVault[] | undefined,
        assetAccounts: Hooks.UseHorizonTypes.IAssetAccounts[] | undefined,
        asset: Hooks.UseAssetsTypes.IAssetDto,
        isAuthorired: boolean
      ) => Hooks.UseVaultsTypes.IVault[]
      vaultsToStatusName: (
        vaults: Hooks.UseVaultsTypes.IVault[] | undefined,
        assetAccounts: Hooks.UseHorizonTypes.IAssetAccounts[] | undefined,
        asset: Hooks.UseAssetsTypes.IAssetDto
      ) => Hooks.UseVaultsTypes.IVaultAccountName[]
    }
  }
}
