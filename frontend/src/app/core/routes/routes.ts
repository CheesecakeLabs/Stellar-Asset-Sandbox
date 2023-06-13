import { PathRoute } from 'components/enums/path-route'

import { Home } from '../pages/home'
import { Profile } from '../pages/profile'
import { Settings } from '../pages/settings'
import { AppRoute } from './types'

export const coreRoutes: AppRoute[] = [
  { path: PathRoute.HOME, component: Home, isPrivate: true },
  { path: PathRoute.PROFILE, component: Profile, isPrivate: true },
  { path: PathRoute.SETTINGS, component: Settings, isPrivate: true },
]
