<script setup lang="ts">
import { provideThemeMode, getPreferThemeMode } from './hooks/useThemeMode'
import { provideAuthState } from './hooks/useAuthState'

import { useHead } from '@vueuse/head'
import { SITE_DESCRIPTION, SITE_NAME } from './env'

import { ref, onMounted, watch } from 'vue';


useHead({
  meta: [
    { property: 'og:title', content: SITE_NAME },
    { name: 'description', content: SITE_DESCRIPTION },
  ],
})

provideThemeMode()
provideAuthState()

const mainHeight = ref()
const footerRef = ref()

const themeMode = getPreferThemeMode();

onMounted(() => {
  window.addEventListener('resize', () => {
    mainHeight.value = (window.innerHeight - 110 - footerRef.value.$el.offsetHeight) + 'px';
  })
  // Trigger a window resize event to update mainHeight on initial render
  const event = new Event('resize');
  window.dispatchEvent(event);
});

</script>

<template>
  <BackGround v-if="themeMode === 'dark'" />
  <Header />
  <main :style="{ height: mainHeight }">
    <RouterView />
  </main>
  <Footer ref="footerRef" />
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

canvas {
  position: absolute;
  top: 0;
  opacity: 0.15;
  z-index: -999;
}
</style>