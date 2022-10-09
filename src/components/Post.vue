<script lang="ts" setup>
// const props = defineProps<{ frontmatter: Object }>({
//   frontmatter: {}
// })
const props = defineProps({
  a: 0
})

console.log(props.a)

// console.log(props.frontmatter)
</script>

<template>
  <article class="article">
    <slot />
  </article>
</template>