<script lang="ts" setup>
import { AUTHOR } from '~/env'

</script>

<template>
  <footer class="px-24px py-32px mt-64px">
    <div class="mx-auto opacity-50 prose flex justify-between items-center">
      <p style="font-size: .8rem" class="!m-0">
        <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener">CC BY-NC-SA 4.0</a> 2013-PRESENT © {{ AUTHOR }}
      </p>
      <a
        ref="noopener"
        style="font-size: .8rem"
        href="https://beian.miit.gov.cn/"
        target="_blank"
      >桂ICP备18011037号</a>
    </div>
  </footer>
</template>
