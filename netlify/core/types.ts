export const enum CommentStatus {
  Published = 'published',
  Unreviewed = 'unreviewed'
}

export const enum CommentRole {
  Manager = 'manager',
  Visitor = 'visitor'
}

export interface Comment {
  objectId: string,
  id: string,
  nickname: string,
  email: string,
  website?: string,
  content: string,
  publushed: boolean,
  createdAt: string,
  updatedAt: string,
  status: CommentStatus,
  role: CommentRole,
  parent?: string,
  managerNoticed?: boolean,
  parentNoticed?: boolean
}

export type FilledComment = { parent?: FilledComment, children: FilledComment[] } & Exclude<Comment, 'parent'>


export const enum ErrorCode {
  OK = 2000,
  NotFound = 4004,
  Forbidden = 4001,
  Unkown = 5000,
}

export const enum ResponseMessage {
  OK = 'success.',
  NotFound = 'not found.',
  Forbidden = 'forbidden.',
  Unkown = 'unkown error.',
}
