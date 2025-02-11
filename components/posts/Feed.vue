<template>
  <div>
    <template v-if="data">
      <PostsCard
        v-for="post in data"
        :data="post"
      />
    </template>
  </div>
</template>
<script setup lang="ts">
const { data } = useFetch('/api/posts')
</script>