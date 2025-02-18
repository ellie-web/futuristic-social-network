<template>
  <PostsCardModal
    routeAfterClose="/"
    :postId="Number(params.id)"
  />
</template>
<script setup lang="ts">
definePageMeta({
  scrollToTop: false
})

const { params } = useRoute()
</script>