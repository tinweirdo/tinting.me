import { SITE_DOMAIN } from "../../core/env"
import { refreshUrls, getDistFiles } from './utils'

export const handler = async function () {
  const filesToRefresh = getDistFiles('dist')
    .filter((file) => !/\.js|\.css$/.test(file))
    .map((file) => `${SITE_DOMAIN}/${file}`)

  try {
    await refreshUrls(filesToRefresh)
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify(err),
    }
  }
  return {
    statusCode: 200,
  }
}
