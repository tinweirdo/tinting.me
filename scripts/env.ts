import dotenv from 'dotenv'
import fs from 'fs-extra'

const content = fs.readFileSync('./.env').toString()

export default dotenv.parse<{ VITE_SITE_NAME: string, VITE_DOMAIN: string, VITE_AUTHOR: string, VITE_EMAIL: string, VITE_DESCRIPTION: string}>(content)
