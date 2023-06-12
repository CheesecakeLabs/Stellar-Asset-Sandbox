import { PathRoute } from 'components/enums/path-route'

import { Home } from '../pages/home'
import { Profile } from '../pages/profile'
import { AppRoute } from './types'

export const coreRoutes: AppRoute[] = [
  { path: PathRoute.HOME, component: Home, isPrivate: true },
  { path: PathRoute.PROFILE, component: Profile, isPrivate: true },
]
