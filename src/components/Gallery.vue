<template>
  <p class="gallery flex justify-between <w-content:flex-wrap">
    <slot />
  </p>
</template>

<style lang="less" scoped>
.gallery::v-deep(> *) {
  @apply w-1/2 <w-content:w-full mb-1em mt-0 mr-1em last-of-type:mr-0 <w-content:mr-0;
}
</style>
