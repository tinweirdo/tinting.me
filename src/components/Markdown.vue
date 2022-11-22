<script lang="ts" setup>
import { defaultWindow, useEventListener } from '@vueuse/core'
import { useHead } from '@vueuse/head'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { SITE_DESCRIPTION, SITE_NAME } from '~/env'
import { FrontMatter } from '~/types'

const props = defineProps<{ frontmatter: FrontMatter }>()
const content = ref<HTMLElement>()

const { hideSiteName = false, title, custom, keywords, head = {} } = props?.frontmatter ?? {}

useHead({
  title: hideSiteName ? title : title + ' - ' + SITE_NAME,
  meta: [
    { property: 'og:title', content: props.frontmatter.title },
    { name: 'description', content: SITE_DESCRIPTION },
    { name: 'keywords', content: (keywords ?? []).join(', ') },
  ],
  ...head,
})

const router = useRouter()

const navigate = () => {
  if (location.hash) {
    const headerHeight = 56
    const viewportTop = defaultWindow?.document.documentElement.scrollTop ?? 0
    const elTop = document.querySelector(decodeURIComponent(location.hash))?.getBoundingClientRect().top ?? 0
    defaultWindow?.scrollTo({ top: viewportTop + elTop - headerHeight - 16, behavior: 'smooth' })
  }
}

const handleAnchors = (event: MouseEvent & { target: HTMLElement }) => {
  const link = event.target.closest('a')
  if (
    !event.defaultPrevented
    && link
    && event.button === 0
    && link.target !== '_blank'
    && link.rel !== 'external'
    && !link.download
    && !event.metaKey
    && !event.ctrlKey
    && !event.shiftKey
    && !event.altKey
  ) {
    const url = new URL(link.href)
    if (url.origin !== window.location.origin) {
      return
    }
    event.preventDefault()
    const { pathname, hash } = url
    if (hash && (!pathname || pathname === location.pathname)) {
      window.history.replaceState({}, '', hash)
      navigate()
    } else {
      router.push({ path: pathname, hash })
    }
  }
}

onMounted(() => {
  useEventListener(defaultWindow, 'hashchange', navigate)
  useEventListener(content.value!, 'click', handleAnchors, { passive: false })
  setTimeout(navigate, 500)
})
</script>

<template>
  <slot v-if="custom" ref="content" />
  <Post
    v-else
    ref="content"
    class="mt-80px"
    :frontmatter="frontmatter"
  >
    <slot />
  </Post>
</template>
