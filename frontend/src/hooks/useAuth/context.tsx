import { createContext, useCallback, useState } from 'react';



import axios from 'axios';
import { MessagesError } from 'utils/constants/messages-error';



import Authentication from 'app/auth/services/auth';
import { http } from 'interfaces/http';


export const AuthContext = createContext({} as Hooks.UseAuthTypes.IAuthContext)

interface IProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<IProps> = ({ children }) => {
  const [user, setUser] = useState<Hooks.UseAuthTypes.IUser | null>(
    Authentication.getUser()
  )
  const [loading, setLoading] = useState(false)
  const [loadingRoles, setLoadingRoles] = useState(true)
  const [roles, setRoles] = useState<Hooks.UseAuthTypes.IRole[] | undefined>()
  const [users, setUsers] = useState<Hooks.UseAuthTypes.IUserDto[] | undefined>(
    []
  )

  const signIn = async (
    params: Hooks.UseAuthTypes.ISignIn
  ): Promise<Hooks.UseAuthTypes.IUser | null> => {
    setLoading(true)
    try {
      const response = await http.post(`users/login`, params)
      const user = response.data.user

      if (!user) {
        throw new Error()
      }

      Authentication.setToken(user.token)
      setUser(user)

      return user
    } catch (error) {
      if (axios.isAxiosError(error) && error?.response?.status === 400) {
        throw new Error(error.message)
      }
      throw new Error(MessagesError.invalidCredentials)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (
    params: Hooks.UseAuthTypes.ISignUp
  ): Promise<Hooks.UseAuthTypes.IUser | null> => {
    setLoading(true)
    try {
      const response = await http.post(`users/create`, params)
      const user = response.data.user
      if (!user) {
        throw new Error()
      }

      Authentication.setToken(user.token)
      setUser(user)

      return user
    } catch (error) {
      if (axios.isAxiosError(error) && error?.response?.status === 400) {
        throw new Error(error.message)
      }
      throw new Error(MessagesError.signUpFailed)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async (): Promise<boolean> => {
    setLoading(true)
    try {
      const response = await http.post(`users/logout`)
      const isSuccess = response.status === 200
      if (isSuccess) {
        Authentication.logout()
      }
      return isSuccess
    } catch (error) {
      return false
    } finally {
      setLoading(false)
    }
  }

  const getRoles = useCallback(async (): Promise<void> => {
    setLoadingRoles(true)
    try {
      const response = await http.get(`role`)
      const data = response.data
      if (data) {
        setRoles(data)
      }
    } catch (error) {
      return
    } finally {
      setLoadingRoles(false)
    }
  }, [])

  const getAllUsers = useCallback(async (): Promise<void> => {
    setLoading(true)
    try {
      const response = await http.get(`users/list-users`)
      const data = response.data
      if (data) {
        const result = data.filter(
          (user: Hooks.UseAuthTypes.IUserDto) =>
            user.email !== Authentication.getUser()?.email
        )
        setUsers(result)
      }
    } catch (error) {
      return
    } finally {
      setLoading(false)
    }
  }, [])

  const updateUserRole = async (
    params: Hooks.UseAuthTypes.IUserRole
  ): Promise<boolean> => {
    setLoading(true)
    try {
      const response = await http.post(`users/update-user-role`, params)
      if (response.status !== 200) {
        throw new Error()
      }

      return true
    } catch (error) {
      if (axios.isAxiosError(error) && error?.response?.status === 400) {
        throw new Error(error.message)
      }
      throw new Error(MessagesError.signUpFailed)
    } finally {
      setLoading(false)
    }
  }

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        signUp,
        getRoles,
        getAllUsers,
        updateUserRole,
        isAuthenticated,
        loading,
        loadingRoles,
        roles,
        users,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}