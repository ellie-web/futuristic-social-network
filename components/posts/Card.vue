<template>
  <UCard class="relative">
    <template #header>
      <div class="flex items-center">
        <UAvatar
          :src="avatarUrl"
          icon="i-heroicons-photo"
          class="mr-3"
          img-class="object-cover"
        />
        <ULink :to="`/users/${props.data.authorId}`">
          {{ props.data.author.name }}
        </ULink>
      </div>
    </template>

    {{ props.data.content }}

    <template #footer>
      {{ props.data.createdAt }}
    </template>
  </UCard>
</template>
<script setup lang="ts">
import type { IFeedPost } from '~/types/post'

const props = defineProps<{ data: IFeedPost }>()
const avatarUrl = computed(() => props.data.author.avatarUrl ? `/api/files?fileName=${props.data.author.avatarUrl}` : undefined)
</script>