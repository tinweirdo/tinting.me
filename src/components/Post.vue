<script lang="ts" setup>
const props = defineProps({
  frontmatter: Object
})

console.log(props.frontmatter)
</script>

<template>
  <article class="article">
    <slot />
  </article>
</template>