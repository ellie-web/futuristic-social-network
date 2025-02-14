<template>
  <div class="h-[100dvh] flex flex-col">
    <UHorizontalNavigation :links="links" />
    <slot />
  </div>
</template>
<script setup lang="ts">
const userStore = useUserStore()
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
  userStore.user && {
    label: 'my page',
    to: `/users/${userStore.user?.id}`
  }
])
</script>