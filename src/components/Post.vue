<script lang="ts" setup>
import { FrontMatter } from '~/types'
defineProps<{ frontmatter: FrontMatter }>()
</script>

<template>
  <article class="mx-24px">
    <div class="max-w-65ch m-auto mb-2.2em">
      <h1 v-if="frontmatter.title" class="text-2.25em font-bold mb-0.1em text-deeper leading-tight">
        {{ frontmatter.title }}
      </h1>
      <h2 v-if="frontmatter.subtitle" class="text-lite text-1.5em italic mb-1em">
        {{ frontmatter.subtitle }}
      </h2>
      <PostMeta class="mt-20px" :frontmatter="frontmatter" />
    </div>
    <slot />
  </article>
</template>
