<script lang="ts" setup>
import { defaultWindow, isClient, useEventListener } from '@vueuse/core'
import { useHead } from '@vueuse/head'
import { onMounted, ref, provide, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { SITE_DESCRIPTION, SITE_NAME } from '~/env'
import { KEY as FrontMatterKey } from '~/hooks/useFrontMatter'
import { PLACEHOLDER_IMAGE, isSupportWebp } from '~/utils'
import { FrontMatter } from '~/types'
import LightBox from '~/plugins/lightbox'

import { navigateToAnchor } from '~/utils'
const props = defineProps<{ frontmatter: FrontMatter }>()
const content = ref<HTMLElement>()

provide(FrontMatterKey, props.frontmatter)

const { hideSiteName = false, title, custom, keywords, comment, head = {}, disableLightBox } = props?.frontmatter ?? {}

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
      navigateToAnchor()
    } else {
      router.push({ path: pathname, hash })
    }
  }
}

const handleImagePreview = () => {
  if (disableLightBox) return
  const imgs = Array
    .from(content.value?.querySelectorAll<HTMLImageElement>('p img') ?? [])
    .filter((img) => !img.getAttribute('data-with-component'))
  for (const img of imgs) {
    img.style.cursor = 'zoom-in'
    img.addEventListener('click', () => LightBox.open(img.src))
  }
}

// intercept anchor navigation
onMounted(() => {
  useEventListener(defaultWindow, 'hashchange', navigateToAnchor)
  useEventListener(content.value!, 'click', handleAnchors, { passive: false })
  handleImagePreview()
  setTimeout(() => {
    if (!location.hash.startsWith('#comment-')) navigateToAnchor()
  }, 500)
})

const observer = isClient ?  new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      const image = entry.target as HTMLImageElement
      image.src = image.dataset.src!
      observer.unobserve(image)
    }
  }
}, {
  rootMargin: '0px 0px 0px 0px',
}) : {} as IntersectionObserver

// lazy load images
onMounted(() => {
  const images = content.value?.querySelectorAll<HTMLImageElement>('img') ?? []
  for (const image of Array.from(images)) {
    const [src, hash] = image.src.split('?')
    const queries = hash?.split('&').reduce((acc, cur) => {
      const [key, value] = cur.split('=')
      acc[key] = value
      return acc
    }, {} as Record<string, string>) ?? {}
    if (queries._w && queries._h) {
      image.style.aspectRatio = `${queries._w} / ${queries._h}`
      Reflect.deleteProperty(queries, '_w')
      Reflect.deleteProperty(queries, '_h')
    }
    if (queries['cdn'] === 'qiniuyun' && queries['format'] !== 'gif' && isSupportWebp) {
      image.setAttribute('data-src', `${src}?imageView2/2/format/webp&${Object.entries(queries).map(([key, value]) => `${key}=${value}`).join('&')}`)
    } else {
      image.setAttribute('data-src', `${src}?${Object.entries(queries).map(([key, value]) => `${key}=${value}`).join('&')}`)
    }
    image.src = PLACEHOLDER_IMAGE
    observer.observe(image)
  }
})

onUnmounted(() => observer.disconnect())
</script>

<template>
  <div ref="content" class="content">
    <slot v-if="custom" />
    <Post
      v-else
      class="my-80px"
      :frontmatter="frontmatter"
    >
      <slot />
    </Post>
  </div>
  <ClientOnly v-if="comment !== 'hidden'">
    <Comment :disabled="comment === 'disabled'" class="w-content my-80px" />
  </ClientOnly>
</template>

<style lang="less" scoped>
.content::v-deep(img) {
  @apply bg-bg-deep;
}
</style>
