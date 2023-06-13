import { Navigate, useLocation } from 'react-router-dom'

import { useAuth } from 'hooks/useAuth'

const AuthRedirect = ({ children }: { children: JSX.Element }): JSX.Element => {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  return children
}

export { AuthRedirect }
