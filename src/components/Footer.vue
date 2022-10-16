<script lang="ts" setup>
import { AUTHOR } from '~/env'

</script>

<template>
  <footer class="py-32px mt-64px">
    <div class="w-content opacity-50 prose">
      <p style="font-size: .8rem" class="!m-0">
        <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener">CC BY-NC-SA 4.0</a>
      </p>
      <p style="font-size: .8rem" class="!m-0 flex items-center justify-between">
        <span>2013-PRESENT © {{ AUTHOR }}</span>
        <a
          ref="noopener"
          href="https://beian.miit.gov.cn/"
          target="_blank"
        >桂ICP备18011037号</a>
      </p>
    </div>
  </footer>
</template>
