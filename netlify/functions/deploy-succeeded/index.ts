import { SITE_DOMAIN } from "../../core/env"
import { prefetchUrls, getDistFiles } from './utils'

export const handler = async function (event, context) {
  const filesToPrefetched = getDistFiles('dist')
    .filter((file) => !/\.js|\.css$/.test(file))
    .map((file) => `${SITE_DOMAIN}/${file}`)

  try {
    await prefetchUrls(filesToPrefetched)
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
