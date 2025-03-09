<template>
  <div class="relative pt-12">
    <div class="fixed top-0 left-0 w-full z-20 bg-gray-900 flex items-center">
      <UHorizontalNavigation
        :links="links"
        class="w-auto"
      />
      <UserSearch />
    </div>
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
    to: `/users/${user.value?.username}`
  }
])
</script>