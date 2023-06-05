declare namespace Hooks {
  namespace UseAssetsTypes {
    interface IAsset {
      icon: string
      asset: string
      name: string
      circulating_supply: number
      treasury: number
      trustlines: number
      status: AssetStatus
    }
  }
}
