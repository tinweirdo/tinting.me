<template>
  <div>
    <div class="flex items-center  mb-16px">
      <div class="bg-bg-deep w-48px h-48px rounded-full mr-12px" />
      <div>
        <p class="bg-bg-deep nickname mb-6px h-1em w-6em" />
        <p class="bg-bg-deep created text-size-0.8em h-1em w-12em" />
      </div>
    </div>
    <div v-for="i in 3" :key="i" class="bg-bg-deep text-size-0.8em leading-snug h-1.2em mb-6px" />
  </div>
</template>
