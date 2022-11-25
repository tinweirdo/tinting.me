<script lang="ts" setup>
import { FilledComment } from 'netlify/core/types'
import { formatDate, getGravatar } from '~/utils'
import { CommentStatus } from 'netlify/core/types'
import useComments from './hooks/useComments'

defineProps<{comment: FilledComment}>()

const { setParent, disabled } = useComments()!

</script>

<template>
  <div class="comment">
    <div :id="'comment-' + comment.objectId" class="text-base" :class="{ 'mb-24px pb-24px border-border border-b-1px border-solid': comment.children?.length }">
      <div class="flex items-center justify-between mb-24px">
        <div class="flex items-center">
          <img class="block rounded-full w-48px h-48px mr-12px bg-lite" :src="getGravatar(comment.email)">
          <div>
            <p class="text-base font-medium mb-6px">
              <a
                v-if="comment.website"
                :href="comment.website"
                rel="noreferrer noopener"
                target="_blank"
              >{{ comment.nickname }}</a>
              <span v-else>{{ comment.nickname }}</span>
            </p>
            <p class="text-lite text-size-0.8em leading-snug">
              {{ formatDate(comment.createdAt) }}
            </p>
          </div>
        </div>
        <div class="flex items-center">
          <a v-if="!disabled" class="text-base hover:text-lite duration-150 tracking-wide cursor-pointer uppercase" @click="setParent(comment)">
            Reply
          </a>
        </div>
      </div>
      <div class="text-base">
        <p><span v-if="comment.parent" class="mr-0.5em text-accent">@{{ comment.parent.nickname }}</span>{{ comment.content }}</p>
        <p v-if="comment.status === CommentStatus.Unreviewed" class="text-size-14px mt-1.2em text-red-500">
          * 此条评论正在等待审核
        </p>
      </div>
    </div>
    <div v-if="comment.children?.length" class="ml-64px">
      <CommentList :comments="comment.children" />
    </div>
  </div>
</template>
