<script lang="ts" setup>
import { ref } from 'vue'
import Logo from './Logo.vue'
import NavBar from './NavBar.vue'
const logoEl = ref<HTMLElement>()
</script>

<template>
  <header class="<w-content:bg-bg-base pt-16px px-24px mb-60px">
    <Logo ref="logoEl" show-author-name class="mb-4px" />
    <NavBar>
      <div class="w-0 transition-all duration-300 h-1px" />
    </NavBar>
  </header>
</template>
