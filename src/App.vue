<script setup lang="ts">
import { provideThemeMode } from './hooks/useThemeMode'
import { provideAuthState } from './hooks/useAuthState'

import { useHead } from '@vueuse/head'
import { SITE_DESCRIPTION, SITE_NAME } from './env'
import { ref } from 'vue';

useHead({
  meta: [
    { property: 'og:title', content: SITE_NAME },
    { name: 'description', content: SITE_DESCRIPTION },
  ],
})

provideThemeMode()
provideAuthState()

// 解决移动端 Footer 位置显示问题
const mainHeight = ref((window.innerHeight - 160) + 'px')
window.addEventListener('resize', () => {
  mainHeight.value = (window.innerHeight - 160) + 'px';
})
</script>

<template>
  <Header />
  <main :style="{ height: mainHeight }">
    <RouterView />
  </main>
  <Footer />
</template>

<style>
main {
  overflow: auto;
  position: relative;
  top: 110px;
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