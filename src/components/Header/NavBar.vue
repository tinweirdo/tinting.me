<script lang="ts" setup>
import { onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'

const menus = [
  { to: '/posts', title: 'Blog'},
  { to: '/projects', title: 'Projects'},
  { to: '/categories', title: 'Categories'},
]
const route = useRoute()

const highlightState = reactive({
  visible: false,
  left: 0,
  with: 0,
  height: 0,
})

const onMouseEnter = ({ target }: MouseEvent) => {
  const { offsetLeft, offsetWidth, offsetHeight } = target as HTMLElement
  highlightState.visible = true
  highlightState.left = offsetLeft
  highlightState.with = offsetWidth
  highlightState.height = offsetHeight - 24
}

const onOut = () => {
  console.log('onOut')
  highlightState.visible = false
}

onMounted(() => {
  const el = document.querySelector<HTMLElement>('.menu-item:first-of-type')
  highlightState.with = el?.offsetWidth ?? 0
  highlightState.height = (el?.offsetHeight ?? 0 ) - 24
})
</script>

<template>
  <nav class="border-b-dark-100 border-b-width-1px flex items-center justify-between leading-24px text-sm sticky top-16px select-none">
    <div class="flex items-center w-full">
      <slot />
      <div class="w-full relative h-56px overflow-hidden">
        <div class="absolute left-0 top-0 -bottom-40px right-0 overflow-x-scroll whitespace-nowrap" @mouseout="onOut" @touchend="onOut">
          <span class="<md:hidden absolute top-12px rounded-4px transition-all opacity-0 bg-bg-deep" :class="{ '!opacity-100': highlightState.visible }" :style="{ width: highlightState.with + 'px', left: highlightState.left + 'px', height: highlightState.height + 'px' }" />
          <RouterLink v-for="menu in menus" :key="menu.to" :to="menu.to">
            <span class="menu-item relative px-12px py-16px inline-block transition-colors duration-300 text-base hover:text-deeper after:content-DEFAULT after:h-2px after:bg-deeper after:absolute after:bottom-0 after:left-12px after:right-12px after:opacity-0" :class="{ 'after:opacity-100 !text-deeper': route.path === menu.to }" @mouseenter="onMouseEnter">
              {{ menu.title }}
            </span>
          </RouterLink>
        </div>
      </div>
    </div>
    <RightBtns class="<w-content:hidden" />
  </nav>
</template>
