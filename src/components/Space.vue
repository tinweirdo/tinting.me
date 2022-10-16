<script lang="ts" setup>
withDefaults(defineProps<{ direction: 'vertical' | 'horizontal', size: number }>(), { direction: 'vertical', size: 0 })
</script>

<template>
  <div v-if="direction === 'horizontal'" :style="{ marginLeft: size + 'px' }" />
  <div v-else :style="{ marginTop: size + 'px'}" />
</template>
