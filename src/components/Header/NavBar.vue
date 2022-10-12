<script lang="ts" setup>
</script>

<template>
  <nav class="border-b-dark-100 border-b-width-1px flex items-center leading-24px text-base text-gray-500 sticky top-16px">
    <slot />
    <span class="bg-gray-300" />
    <router-link to="/posts">
      <span class="px-8px hover:text-dark-700 transition-colors duration-300">Blog</span>
    </router-link>
    <router-link to="/posts">
      <span class="px-8px hover:text-dark-700 transition-colors duration-300">Projects</span>
    </router-link>
  </nav>
</template>
