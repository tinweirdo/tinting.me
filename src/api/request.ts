import axios from 'axios'
import { SITE_DOMAIN } from '~/env'

const request = axios.create({
  baseURL: SITE_DOMAIN + '/api',
})

request.interceptors.request.use()

export default request
