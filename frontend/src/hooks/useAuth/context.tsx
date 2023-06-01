import { createContext, useState } from 'react'

import axios from 'axios'
import { MessagesError } from 'utils/constants/messages-error'

import Authentication from 'app/auth/services/auth'
import { http } from 'interfaces/http'

export const AuthContext = createContext({} as Hooks.UseAuthTypes.IAuthContext)

const BASE_URI = 'api/v1/auth'

interface IProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<IProps> = ({ children }) => {
  const [user, setUser] = useState<Hooks.UseAuthTypes.IUser | null>(
    Authentication.getUser()
  )
  const [loading, setLoading] = useState(false)

  const signIn = async (
    params: Hooks.UseAuthTypes.ISignIn
  ): Promise<Hooks.UseAuthTypes.IUser | null> => {
    setLoading(true)
    try {
      const response = await http.post(`${BASE_URI}/signin`, params)
      const data = response.data.data
      if (!data?.token) {
        throw new Error()
      }

      Authentication.setToken(data.token, params.remember)
      const user = {
        id: 0,
        email: params.email,
      }
      setUser(user)

      const profile = {
        name: data.user,
      }
      Authentication.setUserProfile(profile)

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

  const signOut = async (): Promise<void> => {
    Authentication.logout()
  }

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        isAuthenticated,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
