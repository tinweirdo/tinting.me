<script lang="ts" setup>
import dayjs from 'dayjs'
import { computed } from 'vue'
import usePosts, { Post } from '~/hooks/usePosts'
import { formatDate } from '~/utils'
import PostMeta from './PostMeta.vue'

const props = defineProps<{ category?: string }>()

const posts = usePosts(props.category)

const first = computed(() => posts.value?.[0])
const rest = computed(() => posts.value.slice(1))

const formatted = computed(
  () => {
    const map: { [k: string]: Post[] } = {}
    rest.value.forEach((post) => {
      const year = dayjs(post.date).year()
      map[year] ? map[year].push(post) : (map[year] = [post])
    })
    const formatted: {year: number, posts: Post[]}[] = []
    Object.entries(map).forEach(([year, posts]) => formatted.push({ year: +year, posts }))
    return formatted.reverse()
  },
)

</script>

<template>
  <div v-if="posts.length" class="w-content">
    <article :key="first.path" class="mb-56px">
      <h2 class="!mt-0 !mb-1em">
        <RouterLink :to="first.path" class="!border-none !text-deep">
          {{ first.title }}
        </RouterLink>
      </h2>
      <PostMeta :frontmatter="first.frontmatter" class="!mb-1em" />
      <p class="p-0 !m-0">
        {{ first.excerpt }}
      </p>
    </article>
    <div v-for="{ year, posts } in formatted" :key="year">
      <h1 class="!mt-32px !mb-24px !p-0 text-center !text-lite !text-xl !font-bold opacity-40">
        {{ year }}
      </h1>
      <RouterLink
        v-for="post in posts"
        :key="post.path"
        v-slot="{ navigate }"
        :to="post.path"
        custom
      >
        <article class="py-16px cursor-pointer hover:opacity-70 transition-opacity duration-150 flex justify-between items-center border-solid border-b-1px border-b-border last-of-type:border-none" @click="navigate">
          <h2 class="!p-0 !m-0 overflow-ellipsis overflow-hidden whitespace-nowrap !text-base !text-sm font-bold">
            {{ post.title }}
          </h2>
          <span class="block flex-shrink-0 text-sm text-lite">{{ formatDate(post.date) }}</span>
        </article>
      </RouterLink>
    </div>
  </div>
</template>
