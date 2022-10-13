---
title: About
date: 2022-13-10 20:09:20
category: 编程
---

## H2 title

### H3 title

This is a paragraph. This is a paragraph. This is a paragraph. This is a paragraph. This is a paragraph. This is a paragraph. This is a paragraph. This is a paragraph. This is a paragraph. This is a paragraph. This is a paragraph. This is a paragraph. This is a paragraph. This is a paragraph. This is a paragraph. This is a paragraph. This is a paragraph. This is a paragraph. This is a paragraph. This is a paragraph. This is a paragraph. This is a paragraph. This is a paragraph. This is a paragraph. 

This is a paragraph. This is a paragraph. This is a paragraph. This is a paragraph. This is a paragraph. This is a paragraph. This is a paragraph. This is a paragraph. This is a paragraph. This is a paragraph. 

 - List 1
 - List 2
 - List 3
 - List 4
 - List 5

 1. List 1
 2. List 2
 3. List 3
 4. List 4
 5. List 5

 - [ ] todo undone
 - [x] todo done

 [https://github.com](https://github.com)

 这个是代码 `git clone ssh@github.com.xxx`

```js
import { ViteSSG } from 'vite-ssg'
import autoRoutes from '~pages'
import NProgress from 'nprogress'
import App from './App.vue'

import 'virtual:windi.css'
import './style.less'

const routes = autoRoutes.map((i) => {
  return {
    ...i,
    alias: i.path.endsWith('/')
      ? `${i.path}index.html`
      : `${i.path}.html`,
  }
})

const scrollBehavior = (from: any, to: any, savedPosition: any) => {
  if (savedPosition)
    return savedPosition
  else
    return { top: 0 }
}

export const createApp = ViteSSG(
  App,
  { routes, scrollBehavior },
  ({ router, isClient }) => {

    if (isClient) {
      router.beforeEach(() => { NProgress.start() })
      router.afterEach(() => { NProgress.done() })
    }
  },
)
```

| 属性    | 类型                               | 默认值 |
| ------- | ---------------------------------- | ------ |
| class   | string                             | ''     |
| id      | number                             | 0      |
| counter | `{count: number, current: number}` | 说明   |
 

---

> 这是引用文本这是引用文本这是引用文本这是引用文本这是引用文本
> 这是引用文本
>
> 这是引用文本

<Github />
