<script lang="ts" setup>

const enum ProjectStatus {
  Upcoming ='upcoming',
  Maintaining = 'maintaining',
  Paused = 'maintain paused',
}

interface Project {
  name: string,
  desc?: string,
  icon?: string,
  link: string,
  status?: ProjectStatus
}
defineProps<{ projects: Project[] }>()
</script>

<template>
  <div class="w-content">
    <a
      v-for="item in projects"
      :key="item.name"
      :href="item.link"
      target="_blank"
      class="block flex items-center justify-between !py-32px <w-content:w-full border-b-1px !border-b-border border-solid hover:opacity-50 !transition-opacity !duration-150 relative cursor-pointer"
    >
      <div>
        <h2 class="text-base text-deep !m-0 !p-0">{{ item.name }}</h2>
        <p v-if="item.desc" class="!mt-16px !mb-0 text-lite">{{ item.desc }}</p>
      </div>
      <span v-if="item.status" class="tag flex-shrink-0 ml-12px" :class="`tag_${item.status.replace(/\s+/, '-')}`">{{ item.status }}</span>
    </a>
  </div>
</template>

<style lang="less" scoped>
.tag {
  border-radius: 9999px;
  padding: 0 10px;
  font-size: .8rem;
  text-transform: uppercase;
  color: white;

  &_upcoming {
    background-color: #109edf;
  }
  color: white;

  &_maintaining {
    background-color: #24bc10;
  }

  &_maintain-paused {
    @apply bg-bg-deep !text-deeper;
  }
}
</style>
