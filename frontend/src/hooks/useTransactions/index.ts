import { useContext } from 'react'

import { TransactionsContext } from './context'

export function useTransactions(): Hooks.UseTransactionsTypes.ITransactionsContext {
  const context = useContext(TransactionsContext)

  if (!context) {
    throw new Error('useTransactions must be used within an TransactionsProvider')
  }

  return context
}
