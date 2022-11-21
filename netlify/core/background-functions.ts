import axios, { AxiosRequestConfig } from 'axios'
import { JWT_SECRET, LEANCLOUD_APP_ID, LEANCLOUD_APP_KEY, AUTHOR_DOMAIN } from './env'

const request = axios.create({
  headers: {
    'X-LC-Id': LEANCLOUD_APP_ID,
    'X-LC-Key': LEANCLOUD_APP_KEY,
    'Content-Type': 'application/json',
  },
})

request.interceptors.request.use((config) => {
  config.params.jwt_secret = JWT_SECRET
  return Promise.resolve(config)
})

const get = (func: string, path: string, config: AxiosRequestConfig) => request.get(`${AUTHOR_DOMAIN}/api/${func}-background/${path}`, config)

export default {
  get,
}
