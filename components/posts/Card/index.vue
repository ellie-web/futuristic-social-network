<template>
  <PostsCardEditable
    v-if="isEditing"
    :data="data"
  />
  <PostsCardReadOnly
    v-else
    :data="data"
    :link="link"
  />
</template>
<script setup lang="ts">
import type { IFeedPost } from '~/types/feed'

type TProps = {
  data: IFeedPost,
  link?: string
}

const { data, link } = defineProps<TProps>()

const isEditing = ref<boolean>(false)
provideIsEditing(isEditing)

</script>
<style lang="postcss" scoped>
  .post-card div {
    display: inline-block;
  }
</style>