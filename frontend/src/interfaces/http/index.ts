import axios from 'axios'

import Authentication from 'app/auth/services/auth'

export const BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8080/v1'

const http = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

http.interceptors.request.use(
  config => {
      const token = Authentication.getToken()
    if (token && config.headers) {
      config.headers.Authorization = `${token}`
    }
    return Promise.resolve(config)
  },
  error => {
    return Promise.reject(error)
  }
)
http.interceptors.response.use(
  response => {
    return Promise.resolve(response)
  },
  error => {
    const status = error.response?.status || 500
    if (status === 401) {
      Authentication.logout()
      window.location.href = '/sandbox/v2/login/expired'
    }
    return Promise.reject(error)
  }
)

export { http }
