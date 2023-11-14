<script setup lang="ts">
import { provideThemeMode } from './hooks/useThemeMode'
import { useHead } from '@vueuse/head'
import { SITE_DESCRIPTION, SITE_NAME } from './env'
import { provideAuthState } from './hooks/useAuthState'

useHead({
  meta: [
    { property: 'og:title', content: SITE_NAME },
    { name: 'description', content: SITE_DESCRIPTION },
  ],
})

provideThemeMode()
provideAuthState()
</script>

<template>
  <Header />
  <main>
    <RouterView />
  </main>
  <Footer />
</template>

<style>
main {
  overflow: auto;
  position: relative;
  top: 110px;
  height: calc(100vh - 220px);
}
</style>