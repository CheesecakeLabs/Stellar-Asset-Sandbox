import { Navigate, useLocation } from 'react-router-dom'

import { useAuth } from 'hooks/useAuth'

const RequireAuth = ({ children }: { children: JSX.Element }): JSX.Element => {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export { RequireAuth }
