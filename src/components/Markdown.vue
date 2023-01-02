<script lang="ts" setup>
import { defaultWindow, useEventListener } from '@vueuse/core'
import { useHead } from '@vueuse/head'
import { onMounted, ref, provide } from 'vue'
import { useRouter } from 'vue-router'
import { SITE_DESCRIPTION, SITE_NAME } from '~/env'
import { KEY as FrontMatterKey } from '~/hooks/useFrontMatter'
import { FrontMatter } from '~/types'
import LigtBox from '~/plugins/lightbox'

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
    img.addEventListener('click', () => LigtBox.open(img.src))
  }
}

onMounted(() => {
  useEventListener(defaultWindow, 'hashchange', navigateToAnchor)
  useEventListener(content.value!, 'click', handleAnchors, { passive: false })
  handleImagePreview()
  setTimeout(() => {
    if (!location.hash.startsWith('#comment-')) navigateToAnchor()
  }, 500)
})
</script>

<template>
  <div ref="content">
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
