import { BrowserRouter as Router, Routes } from 'react-router-dom'

import { authRoutes } from 'app/auth/routes'

import createModuleRoutes from './module-routes'
import { coreRoutes } from './routes'

const CoreRouter = (): JSX.Element => {
  const routes = [
    createModuleRoutes({
      routePrefix: '',
      routes: coreRoutes,
    }),
    createModuleRoutes({
      routePrefix: '',
      routes: authRoutes,
    }),
  ]

  return (
    <Router basename="/sandbox/v2">
      <Routes>{routes.map(route => route)}</Routes>
    </Router>
  )
}

export { CoreRouter }
