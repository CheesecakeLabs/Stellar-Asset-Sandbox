import React, { ReactNode } from 'react'

import { AssetsProvider } from './useAssets/context'
import { AuthProvider } from './useAuth/context'

interface IProps {
  children: ReactNode
}

export const AppProvider: React.FC<IProps> = ({ children }) => {
  return (
    <AuthProvider>
      <AssetsProvider>{children}</AssetsProvider>
    </AuthProvider>
  )
}
