import { isClient } from '@vueuse/core'
import { App, ComponentInternalInstance, createApp } from 'vue'
import LightBox from './LightBox.vue'

let instane: any

export const setInstance = (v: ComponentInternalInstance | null) => instane = v

export default {
  open: (src: string, caption?: string) => instane?.proxy?.open?.(src, caption),
  close: () => instane?.proxy?.close?.(),
}

export const plugin = {
  install() {
    if (isClient) {
      const el = document.createElement('div')
      document.body.appendChild(el)
      createApp(LightBox).mount(el)
    }
  },
}
