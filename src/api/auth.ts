import request from './request'

export const login = (username: string, password: string) => {
  import('js-sha256')
    .then(({ sha256 }) => {
      return request.post('/login', { username: sha256(username), password: sha256(password) })
    })
}
