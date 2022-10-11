<script lang="ts" setup>
import { useHead } from '@vueuse/head'

const props = defineProps<{ frontmatter: any }>()

const { showSiteName = false, title, custom } = props?.frontmatter ?? {}

useHead({
  title: showSiteName ? title + ' - ' + import.meta.env.VITE_SITE_NAME : title,
  meta: [
    { property: 'og:title', content: props.frontmatter.title },
    { name: 'description', content: import.meta.env.VITE_DESCRIPTION },
  ],
})
</script>

<template>
  <slot v-if="custom" />
  <article
    v-else
    class="m-auto"
  >
    <slot />
  </article>
</template>
