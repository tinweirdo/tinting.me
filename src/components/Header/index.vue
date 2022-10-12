<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useElementVisibility } from '@vueuse/core'
import { AUTHOR, EMAIL } from '~/env'
import NavBar from './NavBar.vue'
const authorEl = ref<HTMLElement>()
const visible = useElementVisibility(authorEl)
</script>

<template>
  <header class="bg-white my-32px px-32px sticky -top-40px border-b-gray-100 border-b-1px border-solid transition-shadow duration-300" :class="{ 'shadow-md shadow-gray-100 ': !visible }">
    <Author ref="authorEl" show-author-name class="mb-8px" />
    <NavBar class="py-16px">
      <div class="w-0px transition-all duration-300" :class="{ '!w-48px': !visible }">
        <Author class="transition-all absolute left-0 top-1/2 transform -translate-y-1/2" :class="{ '!translate-y-0': visible, '-top-full': visible, 'opacity-0': visible }" />
      </div>
    </NavBar>
  </header>
</template>
