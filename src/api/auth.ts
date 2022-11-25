import request, { ResponseBody } from './request'

export const login = (username: string, password: string) => {
  return import('js-sha256')
    .then(({ sha256 }) => {
      return request.post<any, ResponseBody<{ type: string, token: string }>>('/login', { username, password: sha256(password) })
    })
}
