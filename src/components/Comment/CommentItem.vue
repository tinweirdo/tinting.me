<script lang="ts" setup>
import { CommentRole, FilledComment } from 'netlify/core/types'
import { formatDate, getGravatar } from '~/utils'
import { CommentStatus } from 'netlify/core/types'
import useComments from './hooks/useComments'
import CrownIcon from '~icons/fluent-emoji/crown'
import useAuthState from '~/hooks/useAuthState'
import * as CommentApi from '~/api/comments'
import * as MailApi from '~/api/mail'
import { ref } from 'vue'
const props = defineProps<{comment: FilledComment}>()

const { setParent, disabled, onCommentUpdated } = useComments()!

const { isAuthed } = useAuthState()!

const loading = ref(false)

const toggleCommentStatus = () => {
  if (loading.value) return
  const status = props.comment.status === CommentStatus.Published ? CommentStatus.Unreviewed : CommentStatus.Published
  loading.value = true
  CommentApi.updateCommentStatus(props.comment.objectId, status)
    .then(() => {
      onCommentUpdated(props.comment.objectId, { status })
      MailApi.reply(props.comment.objectId)
    })
    .finally(() => loading.value = false)
}

</script>

<template>
  <div class="comment">
    <div :id="'comment-' + comment.objectId" class="text-base" :class="{ 'mb-24px pb-24px border-border border-b-1px border-solid': comment.children?.length }">
      <div class="flex items-center justify-between mb-24px">
        <div class="flex items-center">
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
              <CrownIcon v-if="comment.role === CommentRole.Manager" class="ml-4px transform -translate-y-2px" />
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
          <template v-if="isAuthed">
            <span class="px-12px">·</span>
            <a class="text-base hover:text-lite duration-150 tracking-wide cursor-pointer" :class="{ 'text-lite cursor-not-allowed': loading }" @click="toggleCommentStatus">{{ comment.status !== CommentStatus.Published ? 'Pass' : 'Unpass' }} This Comment</a>
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
