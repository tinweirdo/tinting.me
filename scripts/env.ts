import dotenv from 'dotenv'
import fs from 'fs-extra'

const content = fs.readFileSync('./.env').toString()

export default dotenv.parse<{ VITE_SITE_NAME: string, VITE_SITE_DOMAIN: string, VITE_AUTHOR_NAME: string, VITE_AUTHOR_EMAIL: string, VITE_SITE_DESCRIPTION: string}>(content)
