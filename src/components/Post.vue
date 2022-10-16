<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { FrontMatter } from '~/types'
defineProps<{ frontmatter: FrontMatter }>()
</script>

<template>
  <article>
    <div class="w-content m-auto">
      <div class="mb-2.2em">
        <h1 v-if="frontmatter.title" class="text-2.25em font-bold mb-0.1em text-deeper leading-tight">
          {{ frontmatter.title }}
        </h1>
        <h2 v-if="frontmatter.subtitle" class="text-lite text-1.5em italic mb-1em">
          {{ frontmatter.subtitle }}
        </h2>
        <PostMeta class="mt-20px" :frontmatter="frontmatter" />
      </div>
      <slot class="w-content m-auto" />
    </div>
  </article>
</template>
