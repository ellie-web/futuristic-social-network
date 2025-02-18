<template>
  <div class="relative grid grid-cols-12">
    <div class="sticky top-0 col-span-4 max-h-fit z-10 backdrop-blur-lg">
      <h1>home</h1>
      <div v-if="user">Welcome, {{ user }}!</div>
      <div>
        <UButton @click="userStore.logout">Logout</UButton>
      </div>

      <PostsCreate v-if="loggedIn" />
    </div>

    <div class="relative flex-1 col-span-8">
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
  middleware: ['auth-guard']
})

const userStore = useUserStore()
const { loggedIn, user } = storeToRefs(userStore)
</script>