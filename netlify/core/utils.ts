export const parseQuery = (q: string): Record<string, string> => {
  const query = {}
  for (const s of q.split('&')) {
    const [k, v] = s.split('=')
    query[k] = decodeURIComponent(v ?? '')
  }
  return query
}
