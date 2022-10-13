<script setup lang="ts">
import { provideThemeMode } from './hooks/useThemeMode'
import { useHead } from '@vueuse/head'
import { DESCRIPTION, SITE_NAME } from './env'

useHead({
  meta: [
    { property: 'og:title', content: SITE_NAME },
    { name: 'description', content: DESCRIPTION },
  ],
})

provideThemeMode()
</script>

<template>
  <Header />
  <main>
    <RouterView />
  </main>
</template>
