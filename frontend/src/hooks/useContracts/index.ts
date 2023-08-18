import { useContext } from 'react'

import { ContractsContext } from './context'

export function useContracts(): Hooks.UseContractsTypes.IContractsContext {
  const context = useContext(ContractsContext)

  if (!context) {
    throw new Error('useContracts must be used within an ContractsProvider')
  }

  return context
}
