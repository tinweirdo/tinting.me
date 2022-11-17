import { createTransport } from 'nodemailer'
import { SMTP_HOST, SMTP_PORT, SMTP_EMAIL, SMTP_PASSWORD } from './env'

export const transport = createTransport({
  host: SMTP_HOST,
  port: 25,
  secure: false,
  auth: {
    user: SMTP_EMAIL,
    pass: SMTP_PASSWORD,
  },
})

interface MailOption {
  from: string,
  to: string,
  subject: string,
  text: string
}
