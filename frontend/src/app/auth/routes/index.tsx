import { PathRoute } from 'components/enums/path-route'

import { Login } from 'app/auth/pages/login'
import { AppRoute } from 'app/core/routes/types'

export const authRoutes: AppRoute[] = [
  { path: PathRoute.LOGIN, component: Login, isAuthRedirect: false },
]
