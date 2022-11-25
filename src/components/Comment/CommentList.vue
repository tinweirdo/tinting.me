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
      class="py-24px border-border border-b-1px border-solid"
    />
  </div>
</template>

<style lang="less" scoped>
.comment-list::v-deep .comment:first-child {
  padding-top: 0!important;
}
.comment-list::v-deep .comment:last-child {
  border-bottom: none;
  padding-bottom: 0!important;
}
</style>
