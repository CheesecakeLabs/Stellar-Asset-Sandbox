import { PathRoute } from 'components/enums/path-route'

import { Home } from '../pages/home'
import { AppRoute } from './types'

export const coreRoutes: AppRoute[] = [
  { path: PathRoute.HOME, component: Home, isPrivate: true },
]
