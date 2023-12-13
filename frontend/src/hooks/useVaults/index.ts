import { useContext } from 'react'

import { VaultsContext } from './context'

export function useVaults(): Hooks.UseVaultsTypes.IVaultsContext {
  const context = useContext(VaultsContext)

  if (!context) {
    throw new Error('useVaults must be used within an VaultProvider')
  }

  return context
}
