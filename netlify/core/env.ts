import dotenv from 'dotenv'
import fs from 'fs-extra'

const content = fs.readFileSync('.env').toString()

const VITE_ENV = dotenv.parse<{ VITE_SITE_NAME: string, VITE_SITE_DOMAIN: string, VITE_AUTHOR_NAME: string, VITE_AUTHOR_EMAIL: string, VITE_SITE_DESCRIPTION: string }>(content)

export const JWT_SECRET = process.env.JWT_SECRET as string
export const AUTH_USERNAME = process.env.AUTH_USERNAME as string
export const AUTH_PASSWORD = process.env.AUTH_PASSWORD as string

export const LEANCLOUD_APP_ID = process.env.LEANCLOUD_APP_ID as string
export const LEANCLOUD_APP_KEY = process.env.LEANCLOUD_APP_KEY as string
export const LEANCLOUD_REST_API = process.env.LEANCLOUD_REST_API as string

export const SMTP_HOST = process.env.SMTP_HOST as string
export const SMTP_PORT = (process.env?.SMTP_PORT ?? 25) as number
export const SMTP_EMAIL = process.env.SMTP_EMAIL as string
export const SMTP_PASSWORD = process.env.SMTP_PASSWORD as string

export const QINIU_ACCESS_KEY = process.env.QINIU_ACCESS_KEY as string
export const QINIU_SECRET_KEY = process.env.QINIU_SECRET_KEY as string

export const SITE_NAME = VITE_ENV.VITE_SITE_NAME
export const SITE_DESCRIPTION = VITE_ENV.VITE_SITE_DESCRIPTION
export const SITE_DOMAIN = VITE_ENV.VITE_SITE_DOMAIN
export const AUTHOR_EMAIL = VITE_ENV.VITE_AUTHOR_EMAIL
export const AUTHOR_NAME = VITE_ENV.VITE_AUTHOR_NAME



