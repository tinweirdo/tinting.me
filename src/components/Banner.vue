<script lang="ts" setup>
defineProps<{ title: string }>()
</script>

<template>
  <div class="border-b-border border-solid border-b-1px py-2.5rem">
    <h1 class="w-content !mb-0 !text-2xl">
      {{ title }}
    </h1>
  </div>
</template>
