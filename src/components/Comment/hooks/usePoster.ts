import { defaultWindow } from "@vueuse/core"

interface Poster {
  nickname: string,
  email: string,
  website?: string
}

export const getPoster = (): Poster => {
  return {
    nickname: defaultWindow?.localStorage.getItem('posterNickname') ?? '',
    email: defaultWindow?.localStorage.getItem('posterEmail') ?? '',
    website: defaultWindow?.localStorage.getItem('posterWebsite') ?? '',
  }
}

export const setPoster = ({ nickname, email, website }: Poster) => {
    defaultWindow?.localStorage.setItem('posterNickname', nickname)
    defaultWindow?.localStorage.setItem('posterEmail', email)
    defaultWindow?.localStorage.setItem('posterWebsite', website ?? '')
}

export default () => ({ getPoster, setPoster })
