import { useContext } from 'react'

import { HorizonContext } from './context'

export function useHorizon(): Hooks.UseHorizonTypes.IHorizonContext {
  const context = useContext(HorizonContext)

  if (!context) {
    throw new Error('useHorizon must be used within an HorizonProvider')
  }

  return context
}
