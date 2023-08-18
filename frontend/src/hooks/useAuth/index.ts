import { useContext } from 'react'

import { AuthContext } from './context'

export function useAuth(): Hooks.UseAuthTypes.IAuthContext {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
