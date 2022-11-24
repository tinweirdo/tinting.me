import { InjectionKey, inject, Ref } from 'vue'

export const KEY = Symbol() as InjectionKey<Ref<string>>

export default () => inject(KEY)
