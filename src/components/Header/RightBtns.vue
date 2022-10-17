<script lang="ts" setup>
import { computed } from 'vue'
import useThemeMode, { ThemeMode } from '~/hooks/useThemeMode'
import { Icon } from '@iconify/vue'

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
  <div class="flex-shrink-0 flex items-center <md:hidden">
    <a href="/feed.xml" target="_blank" class="btn mr-4px flex block cursor-pointer p-4px rounded-4px bg-transparent hover:bg-bg-deep">
      <Icon width="24" height="24" icon="humbleicons:rss" />
    </a>
    <a href="https://github.com/WayneWu98" target="_blank" class="btn mr-4px flex block cursor-pointer p-4px rounded-4px bg-transparent hover:bg-bg-deep">
      <Icon width="24" height="24" icon="ant-design:github-filled" />
    </a>
    <span class="btn mr-4px flex block cursor-pointer p-4px rounded-4px bg-transparent hover:bg-bg-deep box-border">
      <Icon
        :icon="themeIcon"
        width="24"
        height="24"
        @click="toggleThemeMode?.()"
      />
    </span>
  </div>
</template>

<style lang="less" scoped>
.btn {
  @apply text-deep;
}
</style>
