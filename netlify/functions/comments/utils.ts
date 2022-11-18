const SENSITIVE_FIELDS = ['updatedAt', 'role', 'status']

export const filterSensitiveFields = (comments: Comment[]) => {
  for (let i = 0; i < comments.length; i++) {
    for (const field of SENSITIVE_FIELDS) {
      Reflect.deleteProperty(comments[i], field)
    }
  }
  return comments
}

export const filterSensitiveFields
