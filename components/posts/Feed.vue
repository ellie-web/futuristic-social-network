<template>
  <div
    ref="postsWrapRef"
    class="h-full w-full absolute left-0 top-0 overflow-auto scrollbar-hide"
  >
    <template v-if="posts && posts">
      <PostsCard
        v-for="post in posts"
        :data="post"
        :key="post.id"
        class="mb-5"
      />
    </template>
    <!-- <template v-if="error">
      {{ error }}
    </template> -->
  </div>

</template>
<script setup lang="ts">
import type { IFeedPost } from '~/types/post'
import { useInfiniteScroll } from '@vueuse/core'

type TNextCursor = string | undefined
type TResponse = {
  posts: IFeedPost[],
  nextCursor: TNextCursor,
  hasMore: boolean
}

const LIMIT = 3

const { userId } = defineProps<{ userId?: number }>()

const postsWrapRef = useTemplateRef<HTMLElement>('postsWrapRef')

const posts = ref<IFeedPost[]>([])
const cursor = ref<TNextCursor>(undefined)
const hasMore = ref<undefined | boolean>(undefined)

const loadMore = async () => {
  try {
    const _data = await $fetch<TResponse>(`/api/posts/feed`, {
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