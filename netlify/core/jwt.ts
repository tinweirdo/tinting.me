import * as jwt from 'jsonwebtoken'
import { JWT_SECRET } from './env'

const ALGORITHM = 'HS256'
const EXPIRES_IN = '6h'
const NBF = '120' // equal to 120ms

export const encode = () => {
  return new Promise<string | undefined>((resolve, reject) => {
    jwt.sign(
      { authed: true },
      JWT_SECRET,
      { expiresIn: EXPIRES_IN, notBefore: NBF, algorithm: ALGORITHM },
      (err, token) => {
        if (err) {
          return void reject(err)
        }
        resolve(token)
      },
    )
  })
}

export const verify = (token: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      JWT_SECRET,
      { algorithms: [ALGORITHM] },
      (err, payload) => {
        if (err) {
          return void reject(err)
        }
        resolve(payload)
      },
    )
  })
}
