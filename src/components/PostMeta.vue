<script lang="ts" setup>
import { FrontMatter } from '~/types'
import { formatDate } from '~/utils'
defineProps<{ frontmatter: FrontMatter }>()
</script>

<template>
  <p class="text-lite text-sm">
    <span v-if="frontmatter.date" class="inline-block after:content-\2022 after:mx-0.5em last-of-type:after:hidden">{{ formatDate(frontmatter.date) }}</span>
    <span v-if="frontmatter.category" class="inline-block after:content-\2022 after:mx-0.5em last-of-type:after:hidden">
      <RouterLink :to="`/category/${frontmatter.category}`" class="!text-lite !border-none !hover:text-base transition-colors">
        {{ frontmatter.category }}
      </RouterLink>
    </span>
  </p>
</template>
