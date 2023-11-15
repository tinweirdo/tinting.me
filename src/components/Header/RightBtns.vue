<script lang="ts" setup>
import useThemeMode, { ThemeMode } from '~/hooks/useThemeMode'
import IconRSS from '~icons/humbleicons/rss'
import IconGithub from '~icons/ant-design/github-filled'
import IconWaningGibbousMoon from '~icons/fluent-emoji/waning-gibbous-moon'
import IconWaningCrescentMoon from '~icons/fluent-emoji/waning-crescent-moon'
import IconLastQuarterMoon from '~icons/fluent-emoji/last-quarter-moon'
const { themeMode, toggleThemeMode } = useThemeMode() ?? {}
</script>

<template>
  <div class="flex-shrink-0 flex items-center <md:hidden">
    <!-- <a href="/feed.xml" target="_blank"
      class="btn mr-4px flex block cursor-pointer p-4px rounded-4px bg-transparent hover:bg-bg-deep">
      <IconRSS width="24" height="24" />
    </a> -->
    <a href="https://github.com/tinweirdo" target="_blank"
      class="btn mr-4px flex block cursor-pointer p-4px rounded-4px bg-transparent hover:bg-bg-deep">
      <IconGithub width="24" height="24" />
    </a>
    <span class="btn mr-4px flex block cursor-pointer p-4px rounded-4px bg-transparent hover:bg-bg-deep box-border"
      @click="toggleThemeMode">
      <IconWaningCrescentMoon v-show="themeMode === ThemeMode.Dark" width="24" height="24" />
      <IconWaningGibbousMoon v-show="themeMode === ThemeMode.Light" width="24" height="24" />
      <IconLastQuarterMoon v-show="themeMode === ThemeMode.Auto" width="24" height="24" />
    </span>
  </div>
</template>

<style lang="less" scoped>
.btn {
  @apply text-deep;
}
</style>
