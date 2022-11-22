<script setup lang="ts">
import { provideThemeMode } from './hooks/useThemeMode'
import { useHead } from '@vueuse/head'
import { SITE_DESCRIPTION, SITE_NAME } from './env'

useHead({
  meta: [
    { property: 'og:title', content: SITE_NAME },
    { name: 'description', content: SITE_DESCRIPTION },
  ],
})

provideThemeMode()
</script>

<template>
  <Header />
  <main>
    <RouterView />
  </main>
  <Footer />
</template>
