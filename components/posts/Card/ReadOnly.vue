<template>
  <UCard
    as="article"
    class="block cursor-pointer"
    :class="{ 'cursor-pointer': !!link }"
    @click="handleClick"
  >
    <template #header>
      <div class="flex items-center">
        <ULink
          :to="`/users/${data.authorId}`"
          class="flex items-center"
        >
          <UAvatar
            :src="avatarUrl"
            icon="i-heroicons-photo"
            class="mr-3"
            img-class="object-cover"
          />
          {{ data.author.name }}
          <FollowUnfollowButton
            v-if="!isCurrentUser"
            :id="data.authorId"
            hide-if-following
            small
            class="ml-3"
          />
        </ULink>

        <div
          v-if="isCurrentUser"
          class="ml-auto"
        >
          <PostsEditMenu :id="data.id" />
        </div>
      </div>
    </template>

    {{ data.content }}

    <template #footer>
      <div class="flex items-center justify-between">
        <PostsLikeButton :post="data" />
        {{ data.createdAt }}
      </div>
    </template>
  </UCard>
</template>
<script setup lang="ts">
import type { IFeedPost } from '~/types/feed'

type TProps = {
  data: IFeedPost,
  link?: string
}

const { data, link } = defineProps<TProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const avatarUrl = computed(() => data.author.avatarUrl ? `/api/files?fileName=${data.author.avatarUrl}` : undefined)
const isCurrentUser = computed(() => data.authorId === user.value?.id)

const handleClick = async () => {
  if (!link) {
    return false
  }
  await navigateTo(link)
}
</script>
<style lang="postcss" scoped>
  .post-card div {
    display: inline-block;
  }
</style>