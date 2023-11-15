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
  height: calc(100vh - 160px);
}

::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

::-webkit-scrollbar-track {
  border-radius: 2px;
  background-color: transparent;
}

::-webkit-scrollbar-thumb {
  width: 5px;
  height: 5px;
  border-radius: 40px;
  background-color: #999;
}
</style>