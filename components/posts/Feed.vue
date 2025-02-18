<template>
  <ClientOnly>
    <div
      ref="postsWrapRef"
      class="w-full left-0 top-0"
    >
      <template v-if="posts && posts">
        <PostsCard
          v-for="post in posts"
          :data="post"
          :key="post.id"
          :link="userId ? `/users/${userId}/posts/${post.id}` : `/posts/${post.id}`"
          class="mb-5"
        />
      </template>
      <!-- <template v-if="error">
      {{ error }}
    </template> -->
    </div>
  </ClientOnly>


</template>
<script setup lang="ts">
import type { TFeedResponse, TFeedNextCursor } from '~/types/feed'
import { useInfiniteScroll } from '@vueuse/core'

const LIMIT = 3

const { userId } = defineProps<{ userId?: number }>()

const postsWrapRef = useTemplateRef<HTMLElement>('postsWrapRef')

const errorTimeout = ref<any>(null)

const postsStore = usePostsStore()
const { posts } = storeToRefs(postsStore)

const cursor = ref<TFeedNextCursor>(undefined)
const hasMore = ref<undefined | boolean>(undefined)

const loadMore = async () => {
  if (errorTimeout.value) return
  if (isLoading.value) return

  try {
    const _data = await $fetch<TFeedResponse>(`/api/posts/feed`, {
      query: {
        limit: LIMIT,
        cursor: cursor.value,
        userId
      }
    })

    if (_data) {
      posts.value = posts.value.concat(_data.posts)
      cursor.value = _data.nextCursor
      hasMore.value = _data.hasMore
    }
  }
  catch (err) {
    clearTimeout(errorTimeout.value)
    errorTimeout.value = setTimeout(() => errorTimeout.value = null, 5000)
  }
}

const resetData = () => {
  posts.value = []
  cursor.value = undefined
  hasMore.value = undefined
}

const { isLoading, reset } = useInfiniteScroll(
  postsWrapRef,
  loadMore,
  {
    canLoadMore: () => hasMore.value !== false
  }
)

onUnmounted(() => {
  resetData()
  reset()
})
</script>