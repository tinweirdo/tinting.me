<script lang="ts" setup>
defineProps<{ showAuthorName?: boolean }>()
</script>

<template>
  <div class="flex items-center overflow-hidden">
    <RouterLink v-slot="{ navigate, href }" to="/" custom>
      <a class="inline-flex items-center flex-shrink-0" :href="href" @click="navigate">
        <img src="/avatar.jpeg" :alt="SITE_NAME"
          class="rounded-full w-32px h-32px box-border border-1px border-bg-deep border-solid box-border">
        <span v-show="showAuthorName" class="inline-block ml-8px text-deep font-bold">{{ SITE_NAME }}</span>
      </a>
    </RouterLink>
  </div>
</template>
