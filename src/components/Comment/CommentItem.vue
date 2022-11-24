<script lang="ts" setup>
import { FilledComment } from 'netlify/core/types'
import { formatDate } from '~/utils'
import useComments from './hooks/useComments'

defineProps<{comment: FilledComment}>()

const { setParent } = useComments()!

</script>

<template>
  <div class="comment">
    <div :id="'comment-' + comment.objectId" class="text-base" :class="{ 'mb-24px pb-24px border-border border-b-1px border-solid': comment.children?.length }">
      <div class="flex items-center justify-between mb-24px">
        <div class="flex items-center">
          <img class="block rounded-full w-48px h-48px mr-12px bg-lite" src="">
          <div>
            <p class="text-base font-medium mb-6px">
              {{ comment.nickname }}
            </p>
            <p class="text-lite text-size-0.8em leading-snug">
              {{ formatDate(comment.createdAt) }}
            </p>
          </div>
        </div>
        <div class="">
          <a class="text-base hover:text-lite duration-150 tracking-wide cursor-pointer" @click="setParent(comment)">
            Reply
          </a>
        </div>
      </div>
      <div class="text-base">
        {{ comment.content }}
      </div>
    </div>
    <div v-show="comment.children?.length" class="ml-64px">
      <CommentList :comments="comment.children" />
    </div>
  </div>
</template>
