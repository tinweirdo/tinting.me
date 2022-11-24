import { isClient } from "@vueuse/core"

interface Poster {
  nickname: string,
  email: string,
  website?: string
}

export const getPoster = (): Poster => {
  if (!isClient) {
    return {
      nickname: '',
      email: '',
      website: '',
    }
  }
  return {
    nickname: localStorage.getItem('posterNickname') ?? '',
    email: localStorage.getItem('posterEmail') ?? '',
    website: localStorage.getItem('posterWebsite') ?? '',
  }
}

export const setPoster = ({ nickname, email, website }: Poster) => {
  if (isClient) {
    localStorage.setItem('posterNickname', nickname)
    localStorage.setItem('posterEmail', email)
    localStorage.setItem('posterWebsite', website ?? '')
  }
}

export default () => ({ getPoster, setPoster })
