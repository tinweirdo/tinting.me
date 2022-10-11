<script setup lang="ts">
import useThemeMode from './hooks/useThemeMode'
import { useHead } from '@vueuse/head'

useHead({
  meta: [
    { property: 'og:title', content: import.meta.env.VITE_TITLE },
    { name: 'description', content: import.meta.env.VITE_DESCRIPTION },
  ],
})

useThemeMode()
</script>

<template>
  <Header />
  <main>
    <ClientOnly />
    <router-view />
  </main>
</template>
