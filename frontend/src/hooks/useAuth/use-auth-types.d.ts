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
      admin: id
    }

    interface IUserRole {
      id_user: number
      id_role: number
    }

    interface IUserPermission {
      name: string
      action: string
    }

    interface IRolePermission {
      role_id: number
      permission_id: number
    }

    interface IPermission {
      id: number
      name: string
      description: string
    }

    interface IAuthContext {
      signIn: (params: ISignIn) => Promise<IUser | null>
      signUp: (params: ISignUp) => Promise<IUser | null>
      signOut: () => Promise<boolean>
      getRoles: () => Promise<Hooks.UseAuthTypes.IRole[] | undefined>
      getAllUsers: () => Promise<void>
      getProfile: () => Promise<void>
      editUsersRole: (params: IUserRole) => Promise<boolean>
      getUserPermissions: () => Promise<
        Hooks.UseAuthTypes.IUserPermission[] | undefined
      >
      getRolesPermissions: () => Promise<
        Hooks.UseAuthTypes.IRolePermission[] | undefined
      >
      getPermissions: () => Promise<
        Hooks.UseAuthTypes.IPermission[] | undefined
      >
      editProfile: (params: IUserRole) => Promise<boolean>
      updateRolesPermissions: (
        params: Hooks.UseAuthTypes.IRolePermission[]
      ) => Promise<boolean>
      createRole: (name: string) => Promise<boolean>
      updateRole: (id: number, name: string) => Promise<boolean>
      deleteRole: (id: number, idNewUsersRole: number) => Promise<boolean>
      isAuthenticated: boolean
      loading: boolean
      loadingRoles: boolean
      roles: IRole[] | undefined
      users: IUserDto[] | undefined
      profile: IUserDto | undefined
      userPermissions: IUserPermission[] | undefined
      rolesPermissions: IRolePermission[] | undefined
      permissions: IPermission[] | undefined
      updatingRolesPermissions: boolean
      creatingRole: boolean
      updatingRole: boolean
      deletingRole: boolean
      loadingUserPermissions: boolean
    }
  }
}
