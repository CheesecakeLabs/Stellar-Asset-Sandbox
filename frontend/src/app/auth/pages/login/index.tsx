import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from 'hooks/useAuth'

import { PathRoute } from 'components/enums/path-route'
import { LoginTemplate } from 'components/templates/login'

export const Login: React.FC = () => {
  const [roles, setRoles] = useState<Hooks.UseAuthTypes.IRole[] | undefined>()
  const [permissions, setPermissions] = useState<
    Hooks.UseAuthTypes.IPermission[] | undefined
  >()
  const [rolePermissions, setRolePermissions] = useState<
    Hooks.UseAuthTypes.IRolePermission[] | undefined
  >()
  const { signIn, signUp, loading: loadingLogin } = useAuth()
  const { getRoles, getPermissions, getRolesPermissions } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    getRoles().then(roles => setRoles(roles))
  }, [getRoles])

  useEffect(() => {
    getPermissions().then(permissions => {
      setPermissions(permissions)
    })
  }, [getPermissions])

  useEffect(() => {
    getRolesPermissions().then(rolePermissions =>
      setRolePermissions(rolePermissions)
    )
  }, [getRolesPermissions])

  const handleLogin = async (
    params: Hooks.UseAuthTypes.ISignIn
  ): Promise<void> => {
    const user = await signIn(params)
    if (user) {
      navigate(PathRoute.HOME)
    }
  }

  const handleSignUp = async (
    params: Hooks.UseAuthTypes.ISignUp
  ): Promise<void> => {
    const user = await signUp(params)
    if (user) {
      navigate(PathRoute.HOME)
    }
  }

  return (
    <LoginTemplate
      handleLogin={handleLogin}
      roles={roles}
      loadingSignIn={loadingLogin}
      permissions={permissions}
      rolesPermissions={rolePermissions}
      loadingRoles={false}
      handleSignUp={handleSignUp}
      loadingSignUp={loadingLogin}
    />
  )
}
