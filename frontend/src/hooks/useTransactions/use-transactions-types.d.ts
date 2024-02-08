declare namespace Hooks {
  namespace UseTransactionsTypes {
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

    interface ISubmitRequest {
      envelope: string
    }

    interface ITransactionsContext {
      loading: boolean
      submit(params: ISubmitRequest): Promise<string | undefined>
      getSponsorPK(): Promise<string | undefined>
    }
  }
}
