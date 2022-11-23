import { ErrorCode } from 'netlify/core/types'
import { InjectionKey, provide, inject, reactive, DeepReadonly, readonly, ComputedRef, computed } from 'vue'
import * as AuthApi from '~/api/auth'

interface AuthState {
  type: string,
  token: string
}

const STORAGE_TYPE_KEY = 'AUTH_TYPE'
const STORAGE_TOKEN_KEY = 'AUTH_TOKEN'

const getState = (): AuthState => {
  return {
    type: localStorage.getItem(STORAGE_TYPE_KEY) ?? '',
    token: localStorage.getItem(STORAGE_TOKEN_KEY) ?? '',
  }
}

const setState = (type: string, token: string) => {
  localStorage.setItem(STORAGE_TYPE_KEY, type)
  localStorage.setItem(STORAGE_TOKEN_KEY, token)
}

const clearState = () => {
  localStorage.removeItem(STORAGE_TYPE_KEY)
  localStorage.removeItem(STORAGE_TOKEN_KEY)
}

const KEY = Symbol() as InjectionKey<{ state: DeepReadonly<{ isAuthed: boolean } & AuthState>, isAuthed: ComputedRef<boolean>, login: (username: string, password: string) => Promise<any>, logout: () => void }>

const cached = getState()

export const state = reactive({
  ...cached,
  isAuthed: !!cached.token,
})

const login = (username: string, password: string) => {
  return AuthApi.login(username, password)
    .then((data) => {
      if (data.code !== ErrorCode.OK) throw new Error(data.message)
      const { type, token } = data.data
      state.type = type
      state.token = token
      state.isAuthed = true
      setState(type, token)
    })
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

