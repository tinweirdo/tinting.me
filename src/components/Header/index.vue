<script lang="ts" setup>
import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import Logo from './Logo.vue'
import NavBar from './NavBar.vue'
const logoEl = ref<HTMLElement>()
let visible = $ref(true)
useIntersectionObserver(logoEl, ([{ isIntersecting }]) => visible = isIntersecting)
</script>

<template>
  <header class="bg-bg-base z-10 pt-16px px-32px sticky -top-52px border-b-border border-b-1px border-solid transition-shadow duration-300">
    <Logo ref="logoEl" show-author-name class="mb-4px" />
    <NavBar>
      <div class="w-0 transition-all duration-300 h-1px" :class="{ '!w-48px': !visible }">
        <Logo class="transition-all absolute left-0 top-1/2 transform -translate-y-1/2" :class="{ '!translate-y-0': visible, '-top-full': visible, 'opacity-0': visible }" />
      </div>
    </NavBar>
  </header>
</template>
