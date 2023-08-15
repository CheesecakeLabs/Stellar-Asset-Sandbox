declare namespace Hooks {
  namespace UseVaultsTypes {
    interface IVault {
      id: number
      name: string
      vault_category: IVaultCategory
      wallet: Hooks.UseWalletsTypes.IWallet
      accountData: Hooks.UseHorizonTypes.IAccount | undefined
    }

    interface IVaultRequest {
      name: string
      vault_category_id: number
      assets_id: number[]
    }

    interface IVaultCategory {
      id: number
      name: string
    }

    interface IVaultCategoryRequest {
      name: string
    }

    interface IVaultUpdateParams {
      name: string
      vault_category_id: number
    }

    interface IVaultsContext {
      loadingVault: boolean
      loadingVaults: boolean
      loadingVaultCategories: boolean
      creatingVault: boolean
      creatingVaultCategory: boolean
      vaults: IVault[] | undefined
      updatingVault: boolean
      getVaults: () => Promise<IVaults[] | undefined>
      getVaultCategories: () => Promise<IVaultCategory[] | undefined>
      createVault: (vault: IVaultRequest) => Promise<IVault | undefined>
      createVaultCategory: (
        vaultCategory: IVaultCategoryRequest
      ) => Promise<IVaultCategory | undefined>
      getVaultById: (id: string) => Promise<IVault | undefined>
      updateVault: (id: number, params: IVaultUpdateParams) => Promise<boolean>
    }
  }
}
