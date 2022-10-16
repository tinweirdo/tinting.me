<script lang="ts" setup>
import dayjs from 'dayjs'
import { computed, ComputedRef } from 'vue'
import { useRouter } from 'vue-router'
import { FrontMatter } from '~/types'
import { formatDate } from '~/utils'
import PostMeta from './PostMeta.vue'

const props = defineProps<{ category?: string }>()

const router = useRouter()

interface Post {
  path: string,
  frontmatter: FrontMatter,
  title: string,
  date: Date,
  category?: string,
  thumb?: string,
  excerpt?: string
}

const posts: ComputedRef<Post[]> = computed(() => {
  return router.getRoutes()
    .filter((route) => {
      if (props.category && route.meta.frontmatter.category !== props.category) {
        return false
      }
      return route.path.startsWith('/posts') && !route.path.endsWith('.html') && route.meta.frontmatter?.date
    })
    .sort((a, b) => +new Date(b.meta.frontmatter.date) - +new Date(a.meta.frontmatter.date) )
    .map(({ meta, path }) => ({
      path,
      frontmatter: meta.frontmatter,
      title: meta.frontmatter.title,
      date: meta.frontmatter.date,
      category: meta.frontmatter.category,
      thumb: meta.frontmatter.thumb,
      excerpt: meta.excerpt,
    }))
})

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
  <template v-if="posts.length">
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
  </template>
</template>
