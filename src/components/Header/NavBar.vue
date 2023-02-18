<script lang="ts" setup>
import { onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'

const menus = [
  { to: '/posts', title: 'Blog'},
  { to: '/projects', title: 'Projects'},
  { to: '/categories', title: 'Categories'},
]
const route = useRoute()
</script>

<template>
  <nav class="border-b-dark-100 border-b-width-1px flex items-center justify-between leading-24px text-sm sticky top-16px select-none">
    <div class="flex items-center w-full font-medium">
      <slot />
      <div class="w-full relative h-56px overflow-hidden">
        <div class="absolute left-0 top-0 -bottom-40px right-0 overflow-x-scroll whitespace-nowrap">
          <RouterLink v-for="menu in menus" :key="menu.to" :to="menu.to">
            <span class=" menu-item relative px-12px py-16px inline-block transition-colors duration-300 text-lite text-base hover:text-deeper" :class="{ '!text-deeper': route.path === menu.to }">
              {{ menu.title }}
            </span>
          </RouterLink>
        </div>
      </div>
    </div>
    <RightBtns class="<w-content:hidden" />
  </nav>
</template>
