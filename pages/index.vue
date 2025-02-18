<template>
  <div class="relative">
    <div class="relative z-10 backdrop-blur-lg">
      <h1>home</h1>
      <div v-if="user">Welcome, {{ user }}!</div>
      <div>
        <UButton @click="userStore.logout">Logout</UButton>
      </div>

      <PostsCreate v-if="loggedIn" />
    </div>

    <div class="relative flex-1">
      <PostsFeed />
    </div>

    <Transition v-bind="transitionConfig">
      <NuxtPage />
    </Transition>
  </div>
</template>
<script setup lang="ts">
import transitionConfig from '~/helpers/transitionsConfig'

definePageMeta({
  middleware: ['auth-guard'],
  key: (route) => {
    if (route.fullPath.includes('/posts/')) {
      return '/'
    }
    return route.fullPath
  }
})

const userStore = useUserStore()
const { loggedIn, user } = storeToRefs(userStore)
</script>