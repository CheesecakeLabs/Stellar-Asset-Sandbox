import React, { ReactNode } from 'react'

import { AssetsProvider } from './useAssets/context'
import { AuthProvider } from './useAuth/context'
import { HorizonProvider } from './useHorizon/context'
import { VaultsProvider } from './useVaults/context'

interface IProps {
  children: ReactNode
}

export const AppProvider: React.FC<IProps> = ({ children }) => {
  return (
    <AuthProvider>
      <HorizonProvider>
        <AssetsProvider>
          <VaultsProvider>{children}</VaultsProvider>
        </AssetsProvider>
      </HorizonProvider>
    </AuthProvider>
  )
}
