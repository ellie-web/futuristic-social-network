<template>
  <UCard>
    <template #header>
      {{ props.data.authorId }}
    </template>

    {{ props.data.content }}

    <template #footer>
      {{ props.data.createdAt }}
    </template>
  </UCard>
</template>
<script setup lang="ts">
import type IPost from '~/types/post'

const props = defineProps<{ data: Omit<IPost, 'author'> }>()
</script>