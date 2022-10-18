<script lang="ts" setup>
import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import NavBar from './NavBar.vue'
const authorEl = ref<HTMLElement>()
const visible = ref(true)
useIntersectionObserver(authorEl, ([{ isIntersecting }]) => visible.value = isIntersecting)
</script>

<template>
  <header class="bg-bg-base z-10 pt-16px px-32px sticky -top-52px border-b-border border-b-1px border-solid transition-shadow duration-300" :class="{ 'shadow-md shadow-gray-100 dark:shadow-transparent': !visible }">
    <Author ref="authorEl" show-author-name class="mb-4px" />
    <NavBar>
      <div class="w-0 transition-all duration-300 h-1px" :class="{ '!w-48px': !visible }">
        <Author class="transition-all absolute left-0 top-1/2 transform -translate-y-1/2" :class="{ '!translate-y-0': visible, '-top-full': visible, 'opacity-0': visible }" />
      </div>
    </NavBar>
  </header>
</template>
