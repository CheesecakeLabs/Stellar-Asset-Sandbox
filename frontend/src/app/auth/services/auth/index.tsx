const LOCAL_STORAGE_KEY = 'token'

const logout = (): void => {
  localStorage.removeItem(LOCAL_STORAGE_KEY)
}

const setToken = (token: string): void => {
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

const Authentication = {
  getUser,
  getToken,
  logout,
  setToken,
}

export default Authentication