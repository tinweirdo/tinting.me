<script lang="ts" setup>
import { onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'

const menus = [
  { to: '/posts', title: 'Blog'},
  { to: '/projects', title: 'Projects'},
  { to: '/about', title: 'About'},
]
const route = useRoute()

const highlightState = reactive({
  visible: false,
  left: 0,
  with: 0,
})

const onMouseEnter = ({ target }: MouseEvent) => {
  const { offsetLeft, offsetWidth } = target as HTMLElement
  highlightState.visible = true
  highlightState.left = offsetLeft
  highlightState.with = offsetWidth
}

const onMouseOut = () => highlightState.visible = false

onMounted(() => {
  highlightState.with = document.querySelector<HTMLElement>('.menu-item:first-of-type')?.offsetWidth ?? 0
})

</script>

<template>
  <nav class="border-b-dark-100 border-b-width-1px flex items-center leading-24px text-sm sticky top-16px">
    <slot />
    <div class="relative" @mouseout="onMouseOut">
      <span class="absolute bg-gray-300 top-12px bottom-12px rounded-4px transition-all opacity-0 bg-gray-100" :class="{ '!opacity-100': highlightState.visible }" :style="{ width: highlightState.with + 'px', left: highlightState.left + 'px' }" />
      <RouterLink v-for="menu in menus" :key="menu.to" :to="menu.to">
        <span class="menu-item relative px-12px py-16px inline-block transition-colors duration-300 text-gray-500 hover:text-dark-900 after:content-DEFAULT after:h-2px after:bg-dark-900 after:absolute after:bottom-0 after:left-12px after:right-12px after:opacity-0" :class="{ 'after:opacity-100 !text-dark-900': route.path === menu.to }" @mouseenter="onMouseEnter">
          {{ menu.title }}
        </span>
      </RouterLink>
    </div>
  </nav>
</template>
