<script setup lang="ts">
import { computed, useSlots } from 'vue'
import useFrontMatter from '~/hooks/useFrontMatter'
import LightBox from '~/plugins/lightbox'

let captionRef = $ref<HTMLElement>()

const props = defineProps<{ src: string }>()

const frontmatter = useFrontMatter()

let enabledLightBox = $computed(() => !frontmatter?.disableLightBox)

const preview = () => {
  if (!enabledLightBox) return
  LightBox.open(props.src, captionRef?.innerHTML ?? '')
}

const slots = useSlots()

const alt = computed(() => slots.default?.()?.[0]?.children as string)

</script>

<template>
  <figure class="w-full">
    <img
      data-with-component="true"
      :src="src"
      :class="{'cursor-zoom-in': enabledLightBox }"
      :alt="alt"
      @click="preview"
    >
    <figcaption ref="captionRef" class="italic">
      <slot />
    </figcaption>
  </figure>
</template>
