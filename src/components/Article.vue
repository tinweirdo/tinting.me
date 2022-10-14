<script lang="ts" setup>
import { formatDate } from '~/utils'
import { FrontMatter } from '~/types'
const props = defineProps<{ frontmatter: FrontMatter }>()
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
      <p class="text-lite text-sm mt-20px">
        <span v-if="frontmatter.date" class="inline-block after:content-\2022 after:mx-0.5em last-of-type:after:hidden">{{ formatDate(frontmatter.date) }}</span>
        <span v-if="frontmatter.category" class="inline-block after:content-\2022 after:mx-0.5em last-of-type:after:hidden hover:text-base transition-colors !duration-0">
          <RouterLink :to="`/category/${frontmatter.category}`">
            {{ frontmatter.category }}
          </RouterLink>
        </span>
      </p>
    </div>
    <slot />
  </article>
</template>
