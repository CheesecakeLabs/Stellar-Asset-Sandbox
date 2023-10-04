import { Flex } from '@chakra-ui/react'
import React, { useState } from 'react'

import { Overview } from './components/overview'
import { SignIn } from './components/signin'
import { SignUp } from './components/signup'

interface ILoginTemplate {
  handleLogin(params: Hooks.UseAuthTypes.ISignIn): Promise<void>
  handleSignUp(params: Hooks.UseAuthTypes.ISignUp): Promise<void>
  loadingSignIn: boolean
  loadingSignUp: boolean
  roles: Hooks.UseAuthTypes.IRole[] | undefined
  permissions: Hooks.UseAuthTypes.IPermission[] | undefined
  rolesPermissions: Hooks.UseAuthTypes.IRolePermission[] | undefined
  loadingRoles: boolean
}

export const LoginTemplate: React.FC<ILoginTemplate> = ({
  handleLogin,
  handleSignUp,
  loadingRoles,
  roles,
  permissions,
  rolesPermissions,
  loadingSignIn,
  loadingSignUp,
}) => {
  const [isSignIn, setIsSignIn] = useState(true)

  return (
    <Flex w="full">
      <Overview
        roles={roles}
        permissions={permissions}
        rolesPermissions={rolesPermissions}
        loading={loadingRoles}
      />
      {isSignIn ? (
        <SignIn
          handleLogin={handleLogin}
          setIsSignIn={setIsSignIn}
          loading={loadingSignIn}
        />
      ) : (
        <SignUp
          handleSignUp={handleSignUp}
          setIsSignIn={setIsSignIn}
          loading={loadingSignUp}
          roles={roles}
          loadingRoles={loadingRoles}
        />
      )}
    </Flex>
  )
}
