import React, { ReactNode } from 'react'

import { AuthProvider } from './useAuth/context'

interface IProps {
  children: ReactNode
}

export const AppProvider: React.FC<IProps> = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>
}
