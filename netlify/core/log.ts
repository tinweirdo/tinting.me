import * as winston from 'winston'
export default winston.createLogger({
  level: 'info',
  transports: [ new winston.transports.Console() ],
})
