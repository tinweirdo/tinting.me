<script lang="ts" setup>
import { computed, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import useThemeMode, { ThemeMode } from '~/hooks/useThemeMode'

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

const onOut = () => {
  console.log('onOut')
  highlightState.visible = false
}

onMounted(() => {
  highlightState.with = document.querySelector<HTMLElement>('.menu-item:first-of-type')?.offsetWidth ?? 0
})

const { themeMode, toggleThemeMode } = useThemeMode() ?? {}

const themeIcon = computed(() => {
  switch (themeMode?.value) {
    case ThemeMode.Light:
      return 'fluent-emoji:waning-gibbous-moon'
    case ThemeMode.Dark:
      return 'fluent-emoji:waning-crescent-moon'
    default:
      return 'fluent-emoji:last-quarter-moon'
  }
})

</script>

<template>
  <nav class="border-b-dark-100 border-b-width-1px flex items-center justify-between leading-24px text-sm sticky top-16px select-none">
    <div class="flex items-center">
      <slot />
      <div class="relative" @mouseout="onOut" @touchend="onOut">
        <span class="absolute top-12px bottom-12px rounded-4px transition-all opacity-0 bg-bg-deep" :class="{ '!opacity-100': highlightState.visible }" :style="{ width: highlightState.with + 'px', left: highlightState.left + 'px' }" />
        <RouterLink v-for="menu in menus" :key="menu.to" :to="menu.to">
          <span class="menu-item relative px-12px py-16px inline-block transition-colors duration-300 text-base hover:text-deeper after:content-DEFAULT after:h-2px after:bg-deeper after:absolute after:bottom-0 after:left-12px after:right-12px after:opacity-0" :class="{ 'after:opacity-100 !text-deeper': route.path === menu.to }" @mouseenter="onMouseEnter">
            {{ menu.title }}
          </span>
        </RouterLink>
      </div>
    </div>
    <Icon
      class="cursor-pointer p-4px rounded-4px bg-transparent hover:bg-bg-deep"
      :icon="themeIcon"
      width="32"
      height="32"
      @click="toggleThemeMode?.()"
    />
  </nav>
</template>
