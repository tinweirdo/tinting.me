import { InjectionKey, provide, inject, reactive, UnwrapNestedRefs, DeepReadonly, readonly, ComputedRef, computed } from 'vue'

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

const provideAuthState = () => {
  const cached = getState()
  const state = reactive({
    ...cached,
    isAuthed: !!cached.token,
  })
  const isAuthed = computed(() => state.isAuthed)
  const login = (username: string, password: string) => {
    // TODO
  }
  const logout = () => {
    state.type = state.token = ''
    state.isAuthed = false
    clearState()
  }
  provide(KEY, { state: readonly(state), isAuthed, login, logout })
}

