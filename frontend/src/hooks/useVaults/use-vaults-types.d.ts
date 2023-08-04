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

    interface IVaultsContext {
      loading: boolean
      vaults: IVault[] | undefined
      vault: IVault | undefined
      vaultCategories: IVaultCategory[] | undefined
      getVaults: () => Promise<void>
      getVaultCategories: () => Promise<void>
      createVault: (vault: IVaultRequest) => Promise<IVault | undefined>
      createVaultCategory: (
        vaultCategory: IVaultCategoryRequest
      ) => Promise<IVaultCategory | undefined>
      getVaultById: (id: string) => Promise<void>
    }
  }
}
