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

    interface ISignRequest {
      envelope: string
      wallet_pk?: string
    }

    interface ISubmitRequest {
      envelope: string
    }

    interface ITransactionsContext {
      loading: boolean
      sign(params: ISignRequest): Promise<string | undefined>
      submit(params: ISubmitRequest): Promise<string | undefined>
    }
  }
}
