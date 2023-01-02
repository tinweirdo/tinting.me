<script lang="ts">
export default {
  name: 'LIGHTBOX',
}
</script>

<script lang="ts" setup>
import { onKeyStroke, useWindowScroll } from '@vueuse/core'
import { getCurrentInstance, watch } from 'vue'
import IconClose from '~icons/clarity/window-close-line'
import { setInstance } from './index'
let visible = $ref(false)
let src = $ref('')
let caption = $ref('')

const open = (_src: string, _caption?: string) => {
  src = _src
  caption = _caption ?? ''
  visible = true
}

const close = () => visible = false

const { y } = useWindowScroll()

watch(y, () => visible = false)

defineExpose({ open, close })

setInstance(getCurrentInstance())

onKeyStroke('Escape', () => visible = false)
</script>

<template>
  <teleport to="body">
    <div class="lightbox prose z-40 fixed top-0 left-0 bottom-0 right-0 flex items-center justify-center opacity-0 transition-opacity duration-300 pointer-events-none bg-bg-base" :class="{ 'opacity-100 pointer-events-auto': visible }">
      <figure class="!mb-0">
        <img :src="src" class="max-w-80vw max-h-80vh cursor-zoom-out" @click="visible = false">
        <figcaption v-if="caption" class="text-center italic !mt-2em absolute bottom-6em w-full left-0" v-html="caption" />
      </figure>
      <IconClose
        class="absolute top-1.5em right-1.5em cursor-pointer"
        width="28"
        height="28"
        @click="visible = false"
      />
    </div>
  </teleport>
</template>

<style lang="less" scoped>
.lightbox {
  img {
    max-width: 80vw;
    max-height: calc(100vh - 24em);
  }
}
</style>
