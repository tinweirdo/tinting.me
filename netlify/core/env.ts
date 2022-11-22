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

export const APP_SITE_NAME = process.env.VITE_SITE_NAME as string
export const APP_AUTHOR_EMAIL = process.env.VITE_EMAIL as string
export const APP_AUTHOR_NAME = process.env.VITE_AUTHOR as string
export const APP_DOMAIN = process.env.VITE_DOMAIN as string
