import { isClient } from '@vueuse/core'
import { createApp } from 'vue'
import Message from './Message.vue'
export * as default from './logic'

export const plugin = {
  install() {
    if (isClient) {
      const el = document.createElement('div')
      document.body.appendChild(el)
      createApp(Message).mount(el)
    }
  },
}
