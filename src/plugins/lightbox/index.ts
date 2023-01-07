import { isClient } from '@vueuse/core'
import { App, ComponentInternalInstance, createApp } from 'vue'
import LightBox from './LightBox.vue'

let instance: any

export const setInstance = (v: ComponentInternalInstance | null) => instance = v

export default {
  open: (src: string, caption?: string) => instance?.exposed?.open?.(src, caption),
  close: () => instance?.exposed?.close?.(),
}

export const plugin = {
  install() {
    const el = document.createElement('div')
    document.body.appendChild(el)
    createApp(LightBox).mount(el)
  },
}
