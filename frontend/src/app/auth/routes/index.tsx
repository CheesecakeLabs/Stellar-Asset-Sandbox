import { PathRoute } from 'components/enums/path-route'

import { Login } from 'app/auth/pages/login'
import { AppRoute } from 'app/core/routes/types'

import { ResetPassword } from '../pages/reset-password'
import { SignUp } from '../pages/sign-up'

export const authRoutes: AppRoute[] = [
  { path: PathRoute.LOGIN, component: Login, isAuthRedirect: false },
  { path: PathRoute.SIGNUP, component: SignUp, isAuthRedirect: false },
  {
    path: PathRoute.RESET_PASSWORD,
    component: ResetPassword,
    isAuthRedirect: false,
  },
]
