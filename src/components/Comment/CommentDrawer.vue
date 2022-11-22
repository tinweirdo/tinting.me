<script lang="ts" setup>
import { ref, reactive } from 'vue'

const opening = ref(true)
</script>

<template>
  <teleport to="body">
    <div class="fixed z-20 top-0 right-0 bottom-0 left-0 backdrop-filter backdrop-blur-xl supports-backdrop-blur:bg-white/95 dark:bg-slate-900/75 duration-300 pointer-events-none" :class="{ '!pointer-events-auto !opacity-80': opening }" />
  </teleport>
</template>
