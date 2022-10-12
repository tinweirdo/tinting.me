<script lang="ts" setup>
import { AUTHOR } from '~/env'

defineProps<{ showAuthorName?: boolean }>()
</script>

<template>
  <div
    class="flex items-center overflow-hidden"
  >
    <RouterLink v-slot="{ navigate, href }" to="/" custom>
      <a class="inline-flex items-center flex-shrink-0" :href="href" @click="navigate">
        <img
          src="/public/avatar.jpeg"
          :alt="AUTHOR"
          class="rounded-full w-32px h-32px box-border border-1"
        >
        <span v-show="showAuthorName" class="inline-block ml-8px">{{ AUTHOR }}</span>
      </a>
    </RouterLink>
  </div>
</template>
