<script lang="ts" setup>
import { CommentRole, FilledComment } from 'netlify/core/types'
import { formatDate, getGravatar } from '~/utils'
import { CommentStatus } from 'netlify/core/types'
import useComments from './hooks/useComments'
import CrownIcon from '~icons/fluent-emoji/crown'
import useAuthState from '~/hooks/useAuthState'
import * as CommentApi from '~/api/comments'
import * as MailApi from '~/api/mail'

// eslint-disable-next-line vue/no-setup-props-destructure
const { comment } = defineProps<{comment: FilledComment}>()

const { setParent, disabled, onCommentUpdated, onCommentDeleted } = useComments()!

const { isAuthed } = useAuthState()!

let loading = $ref(false)

const toggleCommentStatus = () => {
  if (loading) return
  const status = comment.status === CommentStatus.Published ? CommentStatus.Unreviewed : CommentStatus.Published
  loading = true
  CommentApi
    .updateCommentStatus(comment.objectId, status)
    .then(() => {
      onCommentUpdated(comment.objectId, { status })
      MailApi.reply(comment.objectId)
    })
    .finally(() => loading = false)
}

const deleteComment = () => {
  if (loading) return
  loading = true
  CommentApi
    .deleteComment(comment.objectId)
    .then(() => onCommentDeleted(comment.objectId))
    .finally(() => loading = false)
}

</script>

<template>
  <div class="comment">
    <div :id="'comment-' + comment.objectId" class="text-base" :class="{ 'mb-24px pb-24px border-border border-b-1px border-solid': comment.children?.length }">
      <div class="flex items-center justify-between mb-24px">
        <div class="flex items-center mr-16px">
          <img class="block rounded-full w-48px h-48px mr-12px bg-lite" :src="getGravatar(comment.email)">
          <div>
            <p class="text-base font-medium mb-6px flex items-center">
              <a
                v-if="comment.website"
                :href="comment.website"
                style="line-height: 1"
                rel="noreferrer noopener"
                target="_blank"
              >{{ comment.nickname }}</a>
              <span v-else>{{ comment.nickname }}</span>
              <CrownIcon v-if="comment.role === CommentRole.Manager" class="ml-4px transform -translate-y-2px flex-shrink-0" />
            </p>
            <p class="text-lite text-size-0.8em leading-snug">
              {{ formatDate(comment.createdAt) }}
            </p>
          </div>
        </div>
        <div class="flex items-center flex-shrink-0">
          <a v-if="!disabled" class="text-base hover:opacity-60 duration-150 tracking-wide cursor-pointer uppercase" @click="setParent(comment)">
            Reply
          </a>
          <template v-if="isAuthed">
            <a class="ml-16px text-base hover:opacity-60 duration-150 tracking-wide cursor-pointer" :class="{ 'opacity-60 !cursor-not-allowed': loading }" @click="toggleCommentStatus">{{ comment.status !== CommentStatus.Published ? 'Pass' : 'Unpass' }}</a>
            <a class="ml-16px text-base hover:opacity-60 duration-150 tracking-wide cursor-pointer text-red-500 " :class="{ 'opacity-60 !cursor-not-allowed': loading }" @click="deleteComment">Delete</a>
          </template>
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
