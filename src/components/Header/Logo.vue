<script lang="ts" setup>
import { onMounted } from 'vue';
import { SITE_NAME, DOCSEARCH_ID, DOCSEARCH_KEY, DOCSEARCH_INDEXNAME } from '~/env'
import docsearch from '@docsearch/js';
import '@docsearch/css';

onMounted(() => {
  (docsearch as any)({
    appId: DOCSEARCH_ID,
    apiKey: DOCSEARCH_KEY,
    indexName: DOCSEARCH_INDEXNAME,
    insights: true, // Optional, automatically send insights when user interacts with search results
    container: '#docsearch'
  });
})

defineProps<{ showAuthorName?: boolean }>()
</script>

<template>
  <div class="flex items-center overflow-hidden">
    <RouterLink v-slot="{ navigate, href }" to="/" custom>
      <a class="inline-flex items-center flex-shrink-0" :href="href" @click="navigate">
        <img src="/avatar.jpeg" :alt="SITE_NAME"
          class="rounded-full w-32px h-32px box-border border-1px border-bg-deep border-solid box-border">
        <span v-show="showAuthorName" class="inline-block ml-8px text-deep font-bold">{{ SITE_NAME }}</span>
      </a>
    </RouterLink>
    <div id="docsearch"></div>
  </div>
</template>

<style>
.DocSearch-Button {
  height: 25px;
  background: transparent;
  border: 2px solid #d2ddde;
}

.DocSearch-Button-Placeholder {
  font-size: 14px;
}

.DocSearch-Search-Icon {
  stroke-width: 1;
  width: 14px;
}

.DocSearch-Button-Placeholder,
.DocSearch-Button-Keys,
.DocSearch-Footer {
  display: none;
}
</style>
