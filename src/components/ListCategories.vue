<script lang="ts" setup>
import useCategories from '~/hooks/useCategories'

const categories = useCategories()
</script>

<template>
  <div class="w-content">
    <div
      v-for="{name, count} in categories"
      :key="name"
    >
      <RouterLink
        v-slot="{ navigate }"
        :to="`/category/${name}`"
        class="!border-none"
      >
        <div class="py-16px flex items-center justify-between border-solid border-b-1px border-b-border transition-opacity hover:opacity-60 duration-150" @click="navigate">
          <h2 class="!p-0 !m-0 overflow-ellipsis overflow-hidden whitespace-nowrap !text-base !text-sm font-bold">
            {{ name }}
          </h2>
          <span class="block flex-shrink-0 rounded-full block flex-shrink-0 text-sm text-bg-deep bg-deep px-10px scale-50" style="font-size: 12px">{{ count }}</span>
        </div>
      </RouterLink>
    </div>
  </div>
</template>
