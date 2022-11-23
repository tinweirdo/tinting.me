import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { SITE_DOMAIN } from '~/env'
import { ErrorCode } from 'netlify/core/types'
import { logout, state as authState } from '~/hooks/useAuthState'

export interface ResponseBody<T = any> {
  code: ErrorCode,
  data: T,
  message: string
}

const request = axios.create({
  baseURL: SITE_DOMAIN + '/api',
})

request.interceptors.request.use((config) => {
  if (!config.headers) config.headers ={}
  config.headers['Authorization'] = `${authState.type} ${authState.token}`
  return config
})

request.interceptors.response.use((res: AxiosResponse<ResponseBody>) => {
  if (res.data.code === ErrorCode.Forbidden) logout()
  return Promise.resolve(res.data as any)
})

export default request
