declare namespace Hooks {
  namespace UseWalletsTypes {
    interface IWallet {
      id: int
      type: string
      key: IKey
      funded: bool
    }

    interface IKey {
      id: int
      publicKey: string
      weight: int
      walletId: int
    }
  }
}
