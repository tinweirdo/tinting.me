import request from "./request"

export const notice = (objectId: string) => request.post(`/mail/notice`, null, { params: { objectId } })
export const reply = (objectId: string) => request.post(`/mail/reply`, null, { params: { objectId } })
