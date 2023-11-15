<script lang="ts" setup>
import { AUTHOR_NAME } from '~/env'
</script>

<template>
  <footer>
    <div class="w-content opacity-80 prose">
      <p style="font-size: .8rem" class="!m-0">
        <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener">CC BY-NC-SA 4.0</a>
      </p>
      <p style="font-size: .8rem" class="!m-0 flex items-center justify-between">
        <span>2020-PRESENT © {{ AUTHOR_NAME }}</span>
      </p>
    </div>
  </footer>
</template>

<style scoped>
footer {
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>
