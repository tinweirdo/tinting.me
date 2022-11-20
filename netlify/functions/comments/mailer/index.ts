import * as ejs from 'ejs'
import { getComment } from "../../../core/leancloud"
import fs from 'fs-extra'
import logger from '../../../core/log'
import { AUTHOR_DOMAIN, AUTHOR_EMAIL, AUTHOR_NAME, SMTP_EMAIL } from '../../../core/env'
import transport from '../../../core/email'

const SITE_NAME = `${AUTHOR_NAME} 的个人网站`

let tpl: string

const getTpl = async () => {
  if (tpl) {
    return tpl
  }
  const buff = await fs.readFile('netlify/functions/comments/mailer/template.ejs')
  tpl = buff.toString()
  return tpl
}

const reply = async (objectId: string) => {
  try {
    const comment = await getComment(objectId)
    if (!comment?.parent) {
      return
    }
    const tpl = await getTpl()
    const path = comment.id.replace(/^\//, '') ?? ''
    const html = ejs.render(tpl, {
      SITE_NAME,
      AUTHOR_DOMAIN,
      AUTHOR_EMAIL,
      title: `${comment.parent.nickname}, 有人回复了你的评论。`,
      content: comment.content,
      author: comment.nickname,
      links: [
        { label: '点此查看', value: `${AUTHOR_DOMAIN}/${path}#comment-${objectId}` },
      ],
    })
    await transport.sendMail({
      from: `${SITE_NAME} <${SMTP_EMAIL}>`,
      to: comment.parent.email,
      subject: `有人回复了你的评论`,
      text: `你在${SITE_NAME}的评论得到了回复，点击链接查看(${AUTHOR_DOMAIN}/${path}#comment-${objectId})`,
      html,
    })
  } catch (err) {
    logger.error(err?.message ?? err)
  }
}

const notice = async (objectId: string) => {
  try {
    const comment = await getComment(objectId)
    if (!comment) {
      return
    }
    const tpl = await getTpl()
    const path = comment?.id?.replace(/^\//, '') ?? ''
    const html = ejs.render(tpl, {
      SITE_NAME,
      AUTHOR_DOMAIN,
      AUTHOR_EMAIL,
      title: '网站有新的评论',
      content: comment.content,
      author: comment.nickname,
      links: [
        { label: '点此查看', value: `${AUTHOR_DOMAIN}/${path}#comment-${objectId}` },
      ],
    })
    await transport.sendMail({
      from: `${SITE_NAME} <${SMTP_EMAIL}>`,
      to: AUTHOR_EMAIL,
      subject: `网站有新的评论`,
      text: `网站有新的评论，点击链接查看(${AUTHOR_DOMAIN}/${path}#comment-${objectId})`,
      html,
    })
  } catch (err) {
    console.log('send email err', err)
    logger.error(err?.message ?? err)
  }

}

export default {
  reply,
  notice,
}
