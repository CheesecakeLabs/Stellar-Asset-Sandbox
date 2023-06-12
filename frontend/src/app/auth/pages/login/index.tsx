import React from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from 'hooks/useAuth'

import { PathRoute } from 'components/enums/path-route'
import { LoginTemplate } from 'components/templates/login'

export const Login: React.FC = () => {
  const { signIn, loading } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (
    params: Hooks.UseAuthTypes.ISignIn
  ): Promise<void> => {
    const user = await signIn(params)
    if (user) {
      navigate(PathRoute.HOME)
    }
  }

  return <LoginTemplate handleLogin={handleLogin} loading={loading} />
}
