import { createContext, useCallback, useState } from 'react'

import axios from 'axios'
import { useHorizon } from 'hooks/useHorizon'
import { MessagesError } from 'utils/constants/messages-error'

import Authentication from 'app/auth/services/auth'
import { http } from 'interfaces/http'

export const AuthContext = createContext({} as Hooks.UseAuthTypes.IAuthContext)

interface IProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<IProps> = ({ children }) => {
  const [user, setUser] = useState<Hooks.UseAuthTypes.IUser | null>(
    Authentication.getUser()
  )
  const [loading, setLoading] = useState(false)
  const [loadingUserPermissions, setLoadingUserPermissions] = useState(true)
  const [updatingRolesPermissions, setUpdatingRolesPermissions] =
    useState(false)
  const [loadingRoles, setLoadingRoles] = useState(true)
  const [creatingRole, setCreatingRole] = useState(false)
  const [updatingRole, setUpdatingRole] = useState(false)
  const [deletingRole, setDeletingRole] = useState(false)
  const [roles, setRoles] = useState<Hooks.UseAuthTypes.IRole[] | undefined>()
  const [users, setUsers] = useState<Hooks.UseAuthTypes.IUserDto[] | undefined>(
    []
  )
  const [profile, setProfile] = useState<
    Hooks.UseAuthTypes.IUserDto | undefined
  >()
  const [userPermissions, setUserPermissions] = useState<
    Hooks.UseAuthTypes.IUserPermission[] | undefined
  >()
  const [rolesPermissions, setRolesPermissions] = useState<
    Hooks.UseAuthTypes.IRolePermission[] | undefined
  >()
  const [permissions, setPermissions] = useState<
    Hooks.UseAuthTypes.IPermission[] | undefined
  >()
  const { getAccountData } = useHorizon()

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
      if (
        axios.isAxiosError(error) &&
        error?.response?.data.error?.includes('useraccount_email_key')
      ) {
        throw new Error(
          'Failed to register. This email address is already in use.'
        )
      }
      if (axios.isAxiosError(error)) {
        throw new Error(
          `${MessagesError.signUpFailed} ${error?.response?.data.message}`
        )
      }
      throw new Error(`${MessagesError.signUpFailed} ${error}`)
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
        Authentication.logout(true)
      }
      return isSuccess
    } catch (error) {
      return false
    } finally {
      setLoading(false)
    }
  }

  const getRoles = useCallback(async (): Promise<
    Hooks.UseAuthTypes.IRole[] | undefined
  > => {
    setLoadingRoles(true)
    try {
      const response = await http.get(`role`)
      const data = response.data
      if (data) {
        setRoles(data)
        return data
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

  const editUsersRole = async (
    params: Hooks.UseAuthTypes.IUserRole
  ): Promise<boolean> => {
    setLoading(true)
    try {
      const response = await http.post(`users/edit-users-role`, params)
      if (response.status !== 200) {
        throw new Error()
      }

      return true
    } catch (error) {
      if (axios.isAxiosError(error) && error?.response?.status === 400) {
        throw new Error(error.message)
      }
      throw new Error(MessagesError.errorOccurred)
    } finally {
      setLoading(false)
    }
  }

  const getProfile = useCallback(async (): Promise<
    Hooks.UseAuthTypes.IUserDto | undefined
  > => {
    setLoading(true)
    try {
      const response = await http.get(`users/profile`)
      const data = response.data
      if (data) {
        if (data.vault) {
          const accountData = await getAccountData(
            data.vault.wallet.key.publicKey
          )
          data.vault.accountData = accountData
        }
        setProfile(data)
        return data
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error?.response?.status === 400) {
        throw new Error(error.message)
      }
      throw new Error(MessagesError.errorOccurred)
    } finally {
      setLoading(false)
    }
  }, [getAccountData])

  const getUserPermissions = useCallback(async (): Promise<
    Hooks.UseAuthTypes.IUserPermission[] | undefined
  > => {
    setLoadingUserPermissions(true)
    try {
      const response = await http.get(`role-permissions/user-permissions`)
      const data = response.data
      if (data) {
        setUserPermissions(data)
        return data
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error?.response?.status === 400) {
        throw new Error(error.message)
      }
      throw new Error(MessagesError.errorOccurred)
    } finally {
      setLoadingUserPermissions(false)
    }
  }, [])

  const editProfile = async (
    params: Hooks.UseAuthTypes.IUserRole
  ): Promise<boolean> => {
    setLoading(true)
    try {
      const response = await http.post(`users/edit-profile`, params)
      if (response.status !== 200) {
        throw new Error()
      }

      return true
    } catch (error) {
      if (axios.isAxiosError(error) && error?.response?.status === 400) {
        throw new Error(error.message)
      }
      throw new Error(MessagesError.errorOccurred)
    } finally {
      setLoading(false)
    }
  }

  const getRolesPermissions = useCallback(async (): Promise<
    Hooks.UseAuthTypes.IRolePermission[] | undefined
  > => {
    setLoading(true)
    try {
      const response = await http.get(`role-permissions/roles-permissions`)
      const data = response.data
      if (data) {
        setRolesPermissions(data)
        return data
      }
    } catch (error) {
      return
    } finally {
      setLoading(false)
    }
  }, [])

  const getPermissions = useCallback(async (): Promise<
    Hooks.UseAuthTypes.IPermission[] | undefined
  > => {
    setLoading(true)
    try {
      const response = await http.get(`role-permissions/permissions`)
      const data = response.data
      if (data) {
        setPermissions(data)
        return data
      }
    } catch (error) {
      return
    } finally {
      setLoading(false)
    }
  }, [])

  const updateRolesPermissions = async (
    params: Hooks.UseAuthTypes.IRolePermission[]
  ): Promise<boolean> => {
    setUpdatingRolesPermissions(true)
    try {
      const response = await http.put(
        `role-permissions/roles-permissions`,
        params
      )
      if (response.status !== 200) {
        throw new Error()
      }

      return true
    } catch (error) {
      if (axios.isAxiosError(error) && error?.response?.status === 400) {
        throw new Error(error.message)
      }
      throw new Error(MessagesError.errorOccurred)
    } finally {
      setUpdatingRolesPermissions(false)
    }
  }

  const createRole = async (name: string): Promise<boolean> => {
    setCreatingRole(true)
    try {
      const user = Authentication.getUser()

      if (!user?.id) throw new Error('Unauthorized error')

      const response = await http.post(`role`, {
        name: name,
        created_by: Number(user.id),
      })
      if (response.status !== 200) {
        throw new Error()
      }

      return true
    } catch (error) {
      if (axios.isAxiosError(error) && error?.response?.status === 400) {
        throw new Error(error.message)
      }
      throw new Error(MessagesError.errorOccurred)
    } finally {
      setCreatingRole(false)
    }
  }

  const updateRole = async (id: number, name: string): Promise<boolean> => {
    setUpdatingRole(true)
    try {
      const response = await http.put(`role/${id}`, { name: name })
      if (response.status !== 200) {
        throw new Error()
      }

      return true
    } catch (error) {
      if (axios.isAxiosError(error) && error?.response?.status === 400) {
        throw new Error(error.message)
      }
      throw new Error(MessagesError.errorOccurred)
    } finally {
      setUpdatingRole(false)
    }
  }

  const deleteRole = async (
    id: number,
    idNewUsersRole: number
  ): Promise<boolean> => {
    setDeletingRole(true)
    try {
      const response = await http.post(`role/delete/${id}`, {
        new_users_role_id: Number(idNewUsersRole),
      })
      if (response.status !== 200) {
        throw new Error()
      }

      return true
    } catch (error) {
      if (axios.isAxiosError(error) && error?.response?.status === 400) {
        throw new Error(error.message)
      }
      throw new Error(MessagesError.errorOccurred)
    } finally {
      setDeletingRole(false)
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
        editUsersRole,
        getProfile,
        getUserPermissions,
        editProfile,
        getRolesPermissions,
        getPermissions,
        updateRolesPermissions,
        createRole,
        updateRole,
        deleteRole,
        isAuthenticated,
        loading,
        loadingRoles,
        roles,
        users,
        profile,
        userPermissions,
        rolesPermissions,
        permissions,
        updatingRolesPermissions,
        creatingRole,
        updatingRole,
        deletingRole,
        loadingUserPermissions,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
