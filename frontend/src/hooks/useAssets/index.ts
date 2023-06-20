import { useContext } from 'react'

import { AssetsContext } from './context'

export function useAssets(): Hooks.UseAssetsTypes.IAssetsContext {
  const context = useContext(AssetsContext)

  if (!context) {
    throw new Error('useAssets must be used within an AuthProvider')
  }

  return context
}
