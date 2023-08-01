import React, { ReactNode } from 'react'

import { AssetsProvider } from './useAssets/context'
import { AuthProvider } from './useAuth/context'
import { HorizonProvider } from './useHorizon/context'

interface IProps {
  children: ReactNode
}

export const AppProvider: React.FC<IProps> = ({ children }) => {
  return (
    <AuthProvider>
      <HorizonProvider>
        <AssetsProvider>{children}</AssetsProvider>
      </HorizonProvider>
    </AuthProvider>
  )
}
