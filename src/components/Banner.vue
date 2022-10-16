<script lang="ts" setup>
defineProps<{ title: string }>()
</script>

<template>
  <div class="border-b-gray-200 dark:border-b-dark-200 px-24px border-solid border-b-1px py-2.5rem">
    <h1 class="w-content m-auto !mb-0 !text-2xl">
      {{ title }}
    </h1>
  </div>
</template>
