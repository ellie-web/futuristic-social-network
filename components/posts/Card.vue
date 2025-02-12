<template>
  <UCard class="relative">
    <template #header>
      {{ props.data.author.name }}
    </template>
    <div>----------</div>
    <div>----------</div>
    <div>----------</div>
    <div>----------</div>
    {{ props.data.content }}
    <div>----------</div>
    <div>----------</div>
    <div>----------</div>
    <div>----------</div>
    <template #footer>
      {{ props.data.createdAt }}
    </template>
  </UCard>
</template>
<script setup lang="ts">
import type { IFeedPost } from '~/types/post'

const props = defineProps<{ data: IFeedPost }>()
</script>