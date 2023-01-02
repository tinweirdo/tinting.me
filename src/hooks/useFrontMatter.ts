import { inject, InjectionKey } from "vue"
import { FrontMatter } from "~/types"

export const KEY = Symbol() as InjectionKey<FrontMatter>

export default () => inject(KEY)
