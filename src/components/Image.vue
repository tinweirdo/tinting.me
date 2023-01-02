<script setup lang="ts">
import useFrontMatter from '~/hooks/useFrontMatter'
import LigtBox from '~/plugins/lightbox'

let captionRef = $ref<HTMLElement>()

const props = defineProps<{ src: string }>()

const frontmatter = useFrontMatter()

let enabledLightBox = $computed(() => !frontmatter?.disableLightBox)

const preview = () => {
  if (!enabledLightBox) return
  LigtBox.open(props.src, captionRef?.innerHTML ?? '')
}

</script>

<template>
  <figure class="w-full">
    <img
      data-with-component="true"
      :src="src"
      :class="{'cursor-zoom-in': enabledLightBox }"
      @click="preview"
    >
    <figcaption ref="captionRef" class="italic">
      <slot />
    </figcaption>
  </figure>
</template>
