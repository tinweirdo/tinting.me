import { ErrorCode } from 'netlify/core/types'
import { InjectionKey, provide, inject, reactive, DeepReadonly, readonly, ComputedRef, computed } from 'vue'
import * as AuthApi from '~/api/auth'
import message from '~/plugins/message'
import { defaultWindow } from "@vueuse/core"

interface AuthState {
  type: string,
  token: string
}

const STORAGE_TYPE_KEY = 'AUTH_TYPE'
const STORAGE_TOKEN_KEY = 'AUTH_TOKEN'

const getState = (): AuthState => {
  return {
    type: defaultWindow?.localStorage.getItem(STORAGE_TYPE_KEY) ?? '',
    token: defaultWindow?.localStorage.getItem(STORAGE_TOKEN_KEY) ?? '',
  }
}

const setState = (type: string, token: string) => {
  defaultWindow?.localStorage.setItem(STORAGE_TYPE_KEY, type)
  defaultWindow?.localStorage.setItem(STORAGE_TOKEN_KEY, token)
}

const clearState = () => {
  defaultWindow?.localStorage.removeItem(STORAGE_TYPE_KEY)
  defaultWindow?.localStorage.removeItem(STORAGE_TOKEN_KEY)
}

const cached = getState()

export const state = reactive({
  ...cached,
  isAuthed: !!cached.token,
})

const KEY = Symbol() as InjectionKey<{ state: DeepReadonly<{ isAuthed: boolean } & AuthState>, isAuthed: ComputedRef<boolean>, login: () => void, logout: () => void }>

export const login = () => {
  if (state.isAuthed) return
  const username = prompt('Please input the username:')
  const password = prompt('Please input the password:')
  if (!username || !password) {
    message.warn('请输入用户名和密码！')
    return
  }
  return AuthApi.login(username!, password!)
    .then((data) => {
      if (data.code !== ErrorCode.OK) throw new Error(data.message)
      const { type, token } = data.data
      state.type = type
      state.token = token
      state.isAuthed = true
      setState(type, token)
    })
    .catch((err) => message.error(err.message))
}

export const logout = () => {
  state.type = state.token = ''
  state.isAuthed = false
  clearState()
}

export const provideAuthState = () => {
  const isAuthed = computed(() => state.isAuthed)
  provide(KEY, { state: readonly(state), isAuthed, login, logout })
}

export default () => inject(KEY)

