declare namespace Hooks {
  namespace UseTransactionsTypes {
    interface ITransaction {
      icon: string
      asset: string
      name: string
      date: string
      type: TypeTransaction
      amount: number
    }
  }
}
