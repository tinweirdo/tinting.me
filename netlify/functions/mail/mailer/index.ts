import * as ejs from 'ejs'
import { getComment, updateComment } from "../../../core/leancloud"
import fs from 'fs-extra'
import { SITE_DOMAIN, AUTHOR_EMAIL, SMTP_EMAIL, SITE_NAME } from '../../../core/env'
import transport from '../../../core/email'

let tpl: string

const getTpl = async () => {
  if (tpl) {
    return tpl
  }
  const buff = await fs.readFile('netlify/functions/mail/mailer/template.ejs')
  tpl = buff.toString()
  return tpl
}

const reply = async (objectId: string) => {
  const comment = await getComment(objectId)
  if (!comment?.parent || comment?.parentNoticed) {
    return
  }
  const tpl = await getTpl()
  const path = comment.id.replace(/^\//, '') ?? ''
  const html = ejs.render(tpl, {
    SITE_NAME,
    AUTHOR_DOMAIN: SITE_DOMAIN,
    AUTHOR_EMAIL,
    title: `${comment.parent.nickname}, 有人回复了你的评论。`,
    content: comment.content,
    author: comment.nickname,
    links: [
      { label: '点此查看', value: `${SITE_DOMAIN}/${path}#comment-${objectId}` },
    ],
  })
  await transport.sendMail({
    from: `${SITE_NAME} <${SMTP_EMAIL}>`,
    to: comment.parent.email,
    subject: `有人回复了你的评论`,
    text: `你在${SITE_NAME}的评论得到了回复，点击链接查看(${SITE_DOMAIN}/${path}#comment-${objectId})`,
    html,
  })
  await updateComment(objectId, { parentNoticed: true })
}

const notice = async (objectId: string) => {
  const comment = await getComment(objectId)
  if (!comment || comment.managerNoticed) {
    return
  }
  const tpl = await getTpl()
  const path = comment?.id?.replace(/^\//, '') ?? ''
  const html = ejs.render(tpl, {
    SITE_NAME,
    AUTHOR_DOMAIN: SITE_DOMAIN,
    AUTHOR_EMAIL,
    title: '网站有新的评论',
    content: comment.content,
    author: comment.nickname,
    links: [
      { label: '点此查看', value: `${SITE_DOMAIN}/${path}#comment-${objectId}` },
    ],
  })
  await transport.sendMail({
    from: `${SITE_NAME} <${SMTP_EMAIL}>`,
    to: AUTHOR_EMAIL,
    subject: `网站有新的评论`,
    text: `网站有新的评论，点击链接查看(${SITE_DOMAIN}/${path}#comment-${objectId})`,
    html,
  })
  await updateComment(objectId, { managerNoticed: true })
}

export default {
  reply,
  notice,
}
