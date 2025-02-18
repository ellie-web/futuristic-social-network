<template>
  <PostsCardModal
    :routeAfterClose="routeAfterClose"
    :postId="Number(params.postId)"
  />
</template>
<script setup lang="ts">
const { params } = useRoute()

const routeAfterClose = computed(() => `/users/${params.userId}`)
</script>