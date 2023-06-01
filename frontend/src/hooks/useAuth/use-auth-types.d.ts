declare namespace Hooks {
  namespace UseAuthTypes {
    interface ISignIn {
      email: string
      password: string
      remember: boolean
    }

    interface IUser {
      id: number
      email: string
    }

    interface IUserProfile {
      name: string
    }

    interface IAuthContext {
      signIn: (params: ISignIn) => Promise<IUser | null>
      signOut: () => Promise<void>
      isAuthenticated: boolean
      loading: boolean
    }
  }
}
