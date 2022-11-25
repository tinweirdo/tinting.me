<script lang="ts" setup>
import { reactive, ref } from 'vue'
import usePoster from './hooks/usePoster'
import Message from '~/plugins/message'
import { createComment } from '~/api/comments'
import useComments from './hooks/useComments'
import useId from './hooks/useId'
import message from '~/plugins/message'
import * as MailApi from '~/api/mail'
import { watchOnce } from '@vueuse/shared'
import useAuthState from '~/hooks/useAuthState'
import { AUTHOR_EMAIL, AUTHOR_NAME, SITE_DOMAIN } from '~/env'

defineEmits<{ (event: 'cancel'): void }>()

const { onCommentCreateded, parent, setParent } = useComments()!
const id = useId()!

const loading = ref(false)

const { getPoster, setPoster } = usePoster()

const { isAuthed } = useAuthState()!

const { nickname, email, website } = getPoster()

const inputs = reactive({
  nickname,
  email,
  website,
  content: '',
})

watchOnce(isAuthed, (v) => {
  if (v) {
    inputs.email = AUTHOR_EMAIL
    inputs.nickname = AUTHOR_NAME
    inputs.website = SITE_DOMAIN
    setPoster({ email: AUTHOR_EMAIL, nickname: AUTHOR_NAME, website: SITE_DOMAIN })
  }
})

const submit = () => {
  const { nickname, email, website, content } = inputs
  if (!nickname || !email) return void Message.warn('请完善昵称或邮箱！')
  if (!content) return void Message.warn('评论内容不能为空！')
  if (id.value) {
    loading.value = true
    createComment(id.value, { nickname, email, website, content, parent: parent.value?.objectId })
      .then(({ data }) => {
        message.success('发表成功，请等待评论审核！')
        onCommentCreateded(data)
        inputs.content = ''
        MailApi.notice(data.objectId)
      })
      .finally(() => loading.value = false)
  }
  setPoster(inputs)
}

</script>

<template>
  <form class="w-full" @submit.prevent="submit">
    <label class="block max-w-400px">
      <div class="label"><span class="text-red-500">*</span> 昵称</div>
      <input v-model="inputs.nickname" type="text" class="input w-full">
    </label>
    <label class="block max-w-400px">
      <div class="label"><span class="text-red-500">*</span> 邮箱</div>
      <input v-model="inputs.email" type="text" class="input w-full">
    </label>
    <label class="block max-w-400px mb-16px">
      <div class="label">网址</div>
      <input
        v-model="inputs.website"
        type="text"
        class="input w-full"
        placeholder="https://"
      >
    </label>
    <textarea
      v-model="inputs.content"
      maxlength="1000"
      class="input h-10em w-full"
      placeholder="说点什么"
    />
    <div class="mt-16px">
      <button
        type="submit"
        class="button text-size-14px bg-deeper text-bg-base"
        :class="{ 'opacity-70 cursor-not-allowed': loading }"
        :disabled="loading"
      >
        Submit
      </button>
      <button
        v-if="parent"
        class="button text-size-16px !px-0 ml-16px"
        style="color: #e53935"
        type="button"
        @click="setParent()"
      >
        Click Here to Cancel Reply
      </button>
    </div>
  </form>
</template>

<style lang="less" scoped>
.label {
  @apply text-base pb-6px block cursor-pointer text-size-14px;
}
.input {
  @apply mb-12px border-1px border-solid border-border focus:border-base outline-none rounded-sm p-8px text-base placeholder-lite resize-none block bg-bg-base;
}
.button {
  @apply select-none rounded-4px px-32px py-12px hover:opacity-70 duration-200 transition-opacity;
}
</style>
