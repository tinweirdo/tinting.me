<script lang="ts" setup>
import { computed, onMounted, provide, ref } from 'vue'
import CommentQuote from '~icons/mdi/comment-quote'
import SettingsIcon from '~icons/ic/baseline-settings'
import CommentForm from './CommentForm.vue'
import { KEY as ID_KEY } from './hooks/useId'
import { provideComments } from './hooks/useComments'
import { useRoute } from 'vue-router'
import CommentList from './CommentList.vue'

const props = defineProps<{ id?: string }>()

const mounted = ref(false)
const wrap = ref<HTMLElement>()

onMounted(() => mounted.value = true)

const route = useRoute()

const id = computed(() => props.id ?? route.path)
provide(ID_KEY, id)
const { parent, comments } = provideComments(id)
</script>

<script lang="ts">
export default {
    name: "Comment",
}
</script>

<template>
  <div ref="wrap">
    <div class="border-border border-b-1px border-solid pb-12px text-deep flex items-center justify-between mb-40px">
      <span class="flex items-center font-semibold"><CommentQuote class="mr-6px" />22</span>
      <SettingsIcon class="cursor-pointer" />
    </div>
    <CommentList :comments="comments" />
    <teleport v-if="mounted" :to="parent ? '#comment-' + parent.objectId : wrap">
      <CommentForm :class="{ 'mt-32px': parent?.objectId }" />
    </teleport>
  </div>
</template>

<style lang="less">
</style>
