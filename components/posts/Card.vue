<template>
  <UCard class="relative">
    <template #header>
      <ULink :to="`/users/${props.data.authorId}`">
        {{ props.data.author.name }}
      </ULink>
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
</script>