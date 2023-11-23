<script lang="ts" setup>
import { computed, nextTick, onMounted, provide, ref, watch } from 'vue'
import CommentQuote from '~icons/mdi/comment-quote'
import SettingsIcon from '~icons/ic/baseline-settings'
import { KEY as ID_KEY } from './hooks/useId'
import { provideComments } from './hooks/useComments'
import { useRoute } from 'vue-router'
import CommentList from './CommentList.vue'
import CommentForm from './CommentForm.vue'
import CommentSkeleton from './CommentSkeleton.vue'
import { CommentStatus, FilledComment } from 'netlify/core/types'
import useAuthState from '~/hooks/useAuthState'
import LogoutIcon from '~icons/fe/logout'
import { navigateToAnchor } from '~/utils'

const props = defineProps<{ id?: string, disabled?: boolean }>()


let mounted = $ref(false)
const wrap = ref<HTMLElement>()

onMounted(() => mounted = true)

const route = useRoute()

const { isAuthed, login, logout } = useAuthState()!

watch(isAuthed, () => resetComments())

const disabled = computed(() => !!props.disabled && !isAuthed.value)

const id = computed(() => props.id ?? route.path)
provide(ID_KEY, id)
const { loading, parent, setParent, comments, resetComments } = provideComments(id, { disabled })
resetComments()

const countIt = (comment: FilledComment): number => {
  if (!comment?.children?.length) {
    return 1
  }
  return 1 + comment
    .children
    .filter((comment) => comment.status !== CommentStatus.Unreviewed)
    .map(countIt)
    .reduce((n1, n2) => n1 + n2, 0)
}

const total = computed(() => comments
  .value
  .filter((comment) => comment.status !== CommentStatus.Unreviewed)
  .map(countIt)
  .reduce((n1, n2) => n1 + n2, 0),
)

const showManagerEntry = computed(() => Reflect.has(route.query, 'admin'))

const goCommentForm = async (e: MouseEvent) => {
  e.preventDefault()
  setParent()
  await nextTick()
  window.history.replaceState({}, '', '#comment-form')
  navigateToAnchor()
}
</script>

<script lang="ts">
export default {
  name: "Comment",
}
</script>

<template>
  <div class="comment" ref="wrap">
    <div class="border-border border-b-1px border-solid pb-12px text-deep flex items-center justify-between mb-40px">
      <span class="flex items-center font-semibold">
        <CommentQuote class="mr-6px" />{{ total }}
      </span>
      <div class="flex items-center">
        <span v-show="!disabled" class="text-base hover:opacity-70 duration-200 cursor-pointer text-size-14px"
          title="发表一条评论" @click.prevent="goCommentForm">发表一条评论</span>
        <LogoutIcon v-if="isAuthed" class="cursor-pointer ml-8px" @click="logout" />
        <SettingsIcon v-else-if="showManagerEntry" class="cursor-pointer ml-8px" @click="login" />
      </div>
    </div>
    <CommentSkeleton v-if="loading" class="mb-64px" />
    <CommentList v-else class="mb-64px" :comments="comments" />
    <teleport v-if="mounted && !disabled" :to="parent ? '#comment-' + parent.objectId : wrap">
      <CommentForm id="comment-form" :class="{ 'mt-32px': parent?.objectId }" />
    </teleport>
  </div>
</template>

<style scoped>
.comment {
  position: relative;
}
</style>
