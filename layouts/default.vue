<template>
  <div class="relative pt-12">
    <UHorizontalNavigation
      :links="links"
      class="fixed top-0 left-0 w-full z-20 bg-white dark:bg-gray-900"
    />
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