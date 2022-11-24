import { ref, readonly } from 'vue'

let msgCount = 0

type MsgType = 'info' | 'warn' | 'success' | 'error'

interface Msg {
  id: number,
  content: string,
  countdown: number,
  type: MsgType,
  timer?: number
}

const INITIAL_COUNTDOWN = 3000

const _messages = ref<Msg[]>([])

export const messages = readonly(_messages)

interface CreateFn {
  (msg: string): void,
  (msg: { content: string } & Partial<Omit<Msg, 'id'>>): void,
  (msg: any): void,
}

interface TypeFn {
  (msg: string): void,
  (msg: { content: string } & Partial<Omit<Msg, 'id' | 'type'>>): void,
  (msg: any): void,
}

export const close = (id: number) => {
  _messages.value = _messages.value.filter((msg) => {
    if (msg.id === id) {
      clearTimeout(msg.timer)
      return false
    }
    return true
  })
}

const create: CreateFn = (msg: any) => {
  const id = ++msgCount
  const content = (msg.content ?? msg) as string
  const countdown = msg.countdown ?? INITIAL_COUNTDOWN
  const type = (msg.type ?? 'info') as MsgType
  const timer = setTimeout(() => {
    _messages.value = _messages.value.filter((msg) => msg.id !== id)
  }, countdown)
  _messages.value.push({ id, content, countdown, type, timer })
}

export const info: TypeFn = (msg: any) => {
  if (typeof msg === 'string') {
    create({ content: msg, type: 'info' })
  } else {
    create({ ...msg, type: 'info' })
  }
}

export const warn: TypeFn = (msg: any) => {
  if (typeof msg === 'string') {
    create({ content: msg, type: 'warn' })
  } else {
    create({ ...msg, type: 'warn' })
  }
}

export const success: TypeFn = (msg: any) => {
  if (typeof msg === 'string') {
    create({ content: msg, type: 'success' })
  } else {
    create({ ...msg, type: 'success' })
  }
}

export const error: TypeFn = (msg: any) => {
  if (typeof msg === 'string') {
    create({ content: msg, type: 'error' })
  } else {
    create({ ...msg, type: 'error' })
  }
}
