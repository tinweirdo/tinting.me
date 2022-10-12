<script lang="ts" setup>
import { useHead } from '@vueuse/head'
import { DESCRIPTION, SITE_NAME } from '~/env'

interface FrontMatter {
  title: string,
  subtitle?: string,
  date?: Date,
  category?: string,
  tags: string[],
  [k: string]: any
}

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
  <Header />
  <slot v-if="custom" />
  <template v-else>
    <main>
      <article class="m-auto">
        <slot />
      </article>
    </main>
  </template>
</template>
