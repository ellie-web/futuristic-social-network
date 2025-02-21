<template>
  <div class="flex gap-3 text-red">
    <UButton
      @click.stop.prevent="handleSubmit(!isLiked)"
      variant="ghost"
      color="red"
      :icon="icon"
      class="rounded-full"
    >
      {{ _likes + likesAddendum }}
    </UButton>
  </div>
</template>
<script setup lang="ts">
import type { IFeedPost } from '~/types/feed'

const ICON_UNLIKED = 'i-heroicons-heart'
const ICON_LIKED = 'i-heroicons-heart-20-solid'

const props = defineProps<{ post: IFeedPost }>()

const likesStore = useLikesStore()

const { likes: _likes, id: postId, isLiked: _isLiked } = props.post

const isLoading = ref(false)

const _isLikedFromStore = computed(() => likesStore.likes.get(postId))
const isLiked = computed(() => likesStore.likes.get(postId) ?? props.post.isLiked)
const likesAddendum = computed(() => ((_isLikedFromStore.value == undefined) ? 0 : (2 * Number(_isLikedFromStore.value) - 1)))
const icon = computed(() => isLiked.value ? ICON_LIKED : ICON_UNLIKED)

const handleSubmit = async (like: boolean) => {
  const initIsLiked = _isLikedFromStore.value?.valueOf()
  try {
    if (_isLiked !== isLiked.value) {
      likesStore.likes.delete(postId)
    }
    else {
      likesStore.likes.set(postId, like)
    }

    if (isLoading.value) return

    isLoading.value = true
    await $fetch(`/api/posts/${postId}/like`, {
      method: like ? 'POST' : 'DELETE',
      key: like ? `posts/${postId}/like` : `posts/${postId}/unlike`,
      dedupe: 'cancel'
    })
  }
  catch (err) {
    if (initIsLiked === undefined) {
      likesStore.likes.delete(postId)
    }
    else {
      likesStore.likes.set(postId, initIsLiked)
    }
  }
  finally {
    isLoading.value = false
  }
}
</script>