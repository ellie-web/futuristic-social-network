<template>
  <div class="flex-1">
    <h1>home</h1>
    <div v-if="user">Welcome, {{ user }}!</div>
    <div>
      <UButton @click="userStore.logout">Logout</UButton>
    </div>

    <PostsCreate />

    <div class="relative flex-1">

      <PostsFeed />
    </div>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  pageTransition: {
    name: 'slide-fade'
  },
  middleware: ['auth-guard']
})

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
</script>