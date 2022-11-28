<script lang="ts" setup>
// eslint-disable-next-line vue/no-setup-props-destructure
const { direction = 'vertical', size = 0 } = defineProps<{ direction?: 'vertical' | 'horizontal', size?: number }>()
</script>

<template>
  <div v-if="direction === 'horizontal'" :style="{ marginLeft: size + 'px' }" />
  <div v-else :style="{ marginTop: size + 'px'}" />
</template>
