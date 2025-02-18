<template>
  <PostsCardModal
    routeAfterClose="/"
    :postId="Number(params.id)"
  />
</template>
<script setup lang="ts">

const { params } = useRoute()
</script>