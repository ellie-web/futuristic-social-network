<template>
  <PostsCardModal
    :routeAfterClose="routeAfterClose"
    :postId="Number(params.postId)"
  />
</template>
<script setup lang="ts">
definePageMeta({
  scrollToTop: false
})

const { params } = useRoute()

const routeAfterClose = computed(() => `/users/${params.username}`)
</script>