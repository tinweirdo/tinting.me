<script lang="ts" setup>
import { CommentStatus } from 'netlify/core/types'

defineProps<{ status: CommentStatus }>()
</script>

<template>
  <div class="inline-block">
    <div v-if="status === CommentStatus.Published" class="status" style="background-color: #7cb342">
      已审核
    </div>
    <div v-else-if="status === CommentStatus.Unreviewed" class="status" style="background-color: #fb8c00">
      审核中
    </div>
  </div>
</template>

<style lang="less" scoped>
.status {
  @apply text-white py-4px px-8px text-size-13px rounded-full;
}
</style>
