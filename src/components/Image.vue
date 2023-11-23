<script setup lang="ts">
import { computed, useSlots, onMounted, shallowRef } from 'vue'
import useFrontMatter from '~/hooks/useFrontMatter'
import LightBox from '~/plugins/lightbox'

let captionRef = $ref<HTMLElement>()

const props = defineProps<{ src: string, alt?: string, zoom: string }>()

const frontmatter = useFrontMatter()

let enabledLightBox = $computed(() => !frontmatter?.disableLightBox)

const preview = () => {
  if (!enabledLightBox) return
  LightBox.open(props.src, captionRef?.innerHTML ?? '')
}

const slots = useSlots()

const _alt = computed(() => props.alt ?? slots.default?.()?.[0]?.children as string)

const styleOpt = shallowRef({})

onMounted(() => {
  if (props.zoom) {
    styleOpt.value = {
      "max-width": Number(props.zoom) * 100 + "%",
      "margin-left": (0.5 - Number(props.zoom) / 2) * 100 + "%",
    }
  }
})

</script>

<template>
  <figure class="w-full">
    <img :style="styleOpt" data-with-component="true" :src="src" :class="{ 'cursor-zoom-in': enabledLightBox }"
      :alt="_alt" @click="preview">
    <figcaption ref="captionRef" class="italic">
      <slot />
    </figcaption>
  </figure>
</template>
