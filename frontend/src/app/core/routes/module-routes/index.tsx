import React from 'react'
import { Route } from 'react-router-dom'

import { AuthRedirect } from 'app/auth/hocs/auth-redirect'
import { RequireAuth } from 'app/auth/hocs/require-auth'

import { IModuleRouteProps } from '../types'

const createModuleRoutes = ({
  routePrefix = '',
  routes,
}: IModuleRouteProps): React.ReactNode[] => {
  return routes.map(
    ({ component, path, isPrivate = false, isAuthRedirect = false }) => {
      const routeProps = { path: `${routePrefix}${path}` }

      if (isAuthRedirect) {
        return (
          <Route
            path={routeProps.path}
            element={
              <AuthRedirect>{React.createElement(component)}</AuthRedirect>
            }
          />
        )
      }

      if (isPrivate) {
        return (
          <Route
            path={routeProps.path}
            element={
              <RequireAuth>{React.createElement(component)}</RequireAuth>
            }
          />
        )
      }

      return <Route {...routeProps} element={React.createElement(component)} key={path}/>
    }
  )
}

export default createModuleRoutes
