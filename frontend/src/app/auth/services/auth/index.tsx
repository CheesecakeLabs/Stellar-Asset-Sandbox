const LOCAL_STORAGE_KEY = 'token'
const LOCAL_STORAGE_REMEMBER = 'remember_access'
const LOCAL_STORAGE_USER_PROFILE = 'user_profile'

const logout = (): void => {
  localStorage.removeItem(LOCAL_STORAGE_KEY)
}

const setToken = (token: string, remember: boolean): void => {
  if (remember) {
    localStorage.setItem(LOCAL_STORAGE_REMEMBER, 'true')
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, token)
}

const getToken = (): string => {
  return localStorage.getItem(LOCAL_STORAGE_KEY) || ''
}

const getTokenPayload = (jwt: string): Hooks.UseAuthTypes.IUser | null => {
  try {
    return JSON.parse(atob(jwt.split('.')[1]).toString())
  } catch (error) {
    return null
  }
}

const getUser = (): Hooks.UseAuthTypes.IUser | null => {
  const token = getToken()
  if (!token) {
    return null
  }
  return getTokenPayload(token)
}

const setUserProfile = (userProfile: Hooks.UseAuthTypes.IUserProfile): void => {
  localStorage.setItem(LOCAL_STORAGE_USER_PROFILE, JSON.stringify(userProfile))
}

const getUserProfile = (): Hooks.UseAuthTypes.IUserProfile | null => {
  const profile = localStorage.getItem(LOCAL_STORAGE_USER_PROFILE)
  return profile ? JSON.parse(profile) : null
}

const Authentication = {
  getUser,
  getToken,
  logout,
  setToken,
  setUserProfile,
  getUserProfile,
}

export default Authentication
