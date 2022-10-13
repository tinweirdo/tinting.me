<script lang="ts" setup>
import { useHead } from '@vueuse/head'
import { DESCRIPTION, SITE_NAME } from '~/env'
import { FrontMatter } from '~/types'

const props = defineProps<{ frontmatter: FrontMatter }>()

const { hideSiteName = false, title, custom, keywords, tags } = props?.frontmatter ?? {}

useHead({
  title: hideSiteName ? title : title + ' - ' + SITE_NAME,
  meta: [
    { property: 'og:title', content: props.frontmatter.title },
    { name: 'description', content: DESCRIPTION },
    { name: 'keywords', content: (keywords ?? tags ?? []).join(', ') },
  ],
})
</script>

<template>
  <slot v-if="custom" />
  <article v-else class="m-auto mt-56px">
    <Article :frontmatter="frontmatter">
      <slot />
    </Article>
  </article>
</template>
