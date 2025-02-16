<template>
  <div class="h-[100dvh] flex flex-col">
    <UHorizontalNavigation :links="links" />
    <slot />
  </div>
</template>
<script setup lang="ts">
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const links = computed(() => [
  {
    label: 'home',
    to: '/'
  },
  {
    label: 'login',
    to: '/login'
  },
  {
    label: 'register',
    to: '/register'
  },
  user && {
    label: 'my page',
    to: `/users/${user.value?.id}`
  }
])
</script>