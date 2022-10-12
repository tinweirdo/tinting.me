<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useElementVisibility } from '@vueuse/core'
import { AUTHOR, EMAIL } from '~/env'
import NavBar from './NavBar.vue'
const authorEl = ref<HTMLElement>()
const visible = useElementVisibility(authorEl)
</script>

<template>
  <header class="bg-white my-16px px-32px sticky -top-36px border-b-gray-100 border-b-1px border-solid transition-shadow duration-300" :class="{ 'shadow-md shadow-gray-100 ': !visible }">
    <Author ref="authorEl" show-author-name class="mb-4px" />
    <NavBar>
      <div class="w-0px transition-all duration-300" :class="{ '!w-48px': !visible }">
        <Author class="transition-all absolute left-0 top-1/2 transform -translate-y-1/2" :class="{ '!translate-y-0': visible, '-top-full': visible, 'opacity-0': visible }" />
      </div>
    </NavBar>
  </header>
</template>
