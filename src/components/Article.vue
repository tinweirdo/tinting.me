<script lang="ts" setup>
import { FrontMatter } from '~/types'

const props = defineProps<{ frontmatter: FrontMatter }>()
</script>

<template>
  <div class="max-w-65ch m-auto mb-32px">
    <h1 v-if="frontmatter.title" class="text-2xl font-bold mb-8px">
      {{ frontmatter.title }}
    </h1>
    <h2 class="text-lite text-lg italic mb-12px">
      {{ frontmatter.subtitle }}
    </h2>
    <p class="text-lite text-base mb-12px">
      {{ frontmatter.date }}
    </p>
  </div>
  <slot />
</template>
