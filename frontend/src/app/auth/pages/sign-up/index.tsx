import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from 'hooks/useAuth'

import { PathRoute } from 'components/enums/path-route'
import { SignUpTemplate } from 'components/templates/sign-up'

export const SignUp: React.FC = () => {
  const { signUp, loading, roles, getRoles, loadingRoles } = useAuth()
  const navigate = useNavigate()

  const handleSignUp = async (
    params: Hooks.UseAuthTypes.ISignUp
  ): Promise<void> => {
    const user = await signUp(params)
    if (user) {
      navigate(PathRoute.HOME)
    }
  }

  useEffect(() => {
    getRoles()
  }, [getRoles])

  return (
    <SignUpTemplate
      handleSignUp={handleSignUp}
      loading={loading}
      roles={roles}
      loadingRoles={loadingRoles}
    />
  )
}
