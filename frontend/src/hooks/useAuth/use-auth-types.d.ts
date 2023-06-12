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

    interface IAuthContext {
      signIn: (params: ISignIn) => Promise<IUser | null>
      signUp: (params: ISignUp) => Promise<IUser | null>
      signOut: () => Promise<void>
      isAuthenticated: boolean
      loading: boolean
    }
  }
}
