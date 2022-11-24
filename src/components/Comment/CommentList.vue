<script lang="ts" setup>
import { FilledComment } from 'netlify/core/types'
import CommentItem from './CommentItem.vue'

defineProps<{ comments: FilledComment[] }>()
</script>

<template>
  <div class="comment-list">
    <CommentItem
      v-for="comment in comments"
      :key="comment.objectId"
      :comment="comment"
      class="mb-24px pb-24px border-border border-b-1px border-solid"
    />
  </div>
</template>

<style lang="less" scoped>
.comment-list::v-deep .comment:last-child {
  border-bottom: none;
  margin-bottom: 0!important;
  padding-bottom: 0!important;
}
</style>
