declare namespace Hooks {
  namespace UseAuthTypes {
    interface ISignIn {
      email: string
      password: string
    }

    interface ISignUp {
      email: string
      password: string
      name: string
      role_id: number
    }

    interface IUser {
      id: number
      email: string
      name: string
      token: string
      role_id: number
    }

    interface IUserDto {
      id: number
      email: string
      name: string
      role: string
      updated_at: string
      role_id: number
    }

    interface IRole {
      id: number
      name: string
    }

    interface IUserRole {
      id_user: number
      id_role: number
    }

    interface IPermission {
      name: string
      action: string
    }

    interface IAuthContext {
      signIn: (params: ISignIn) => Promise<IUser | null>
      signUp: (params: ISignUp) => Promise<IUser | null>
      signOut: () => Promise<boolean>
      getRoles: () => Promise<void>
      getAllUsers: () => Promise<void>
      getProfile: () => Promise<void>
      editUsersRole: (params: IUserRole) => Promise<boolean>
      getPermissions: () => Promise<void>
      editProfile: (params: IUserRole) => Promise<boolean>
      isAuthenticated: boolean
      loading: boolean
      loadingRoles: boolean
      roles: IRole[] | undefined
      users: IUserDto[] | undefined
      profile: IUserDto | undefined
      permissions: IPermission[] | undefined
    }
  }
}
