import { createTransport } from 'nodemailer'
import { SMTP_HOST, SMTP_PORT, SMTP_EMAIL, SMTP_PASSWORD } from './env'

export default createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false,
  auth: {
    user: SMTP_EMAIL,
    pass: SMTP_PASSWORD,
  },
})
