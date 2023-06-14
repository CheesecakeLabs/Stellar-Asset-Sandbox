import axios from 'axios'

import Authentication from 'app/auth/services/auth'

export const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000'

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
    return Promise.reject(error)
  }
)

export { http }
