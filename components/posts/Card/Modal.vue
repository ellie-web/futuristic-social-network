<template>
  <div class="fixed top-0 left-0 w-full h-full z-30">
    <div class="relative flex justify-center items-center h-full ">
      <div class="relative h-64 w-96 max-w-full z-20">

        <div class="flex justify-center items-center">
          <UButton
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            @click="handleClose"
          />
        </div>
        <PostsCard
          v-if="post"
          :data="post"
          :clickable="false"
        />
      </div>

      <div
        @click="handleClose"
        class="fixed top-0 left-0 w-full h-full z-10 bg-gray-800/75"
      ></div>
    </div>
  </div>
</template>
<script setup lang="ts">
type TProps = {
  routeAfterClose: string,
  postId: number
}

const { routeAfterClose = '/', postId } = defineProps<TProps>()

const postsStore = usePostsStore()
const { showError } = useErrorToast()


const { data: post, error } = await useAsyncData(
  `posts/${postId}`,
  () => postsStore.getPostById(postId)
)

if (error.value?.statusCode === 404) {
  showError({ message: 'Post not found!' })
  await navigateTo(routeAfterClose)
}

const handleClose = async () => {
  return await navigateTo(routeAfterClose)
}
</script>