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
  id?: string,
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
}

export type FilledComment = { parent?: FilledComment, children: FilledComment[] } & Exclude<Comment, 'parent'>
