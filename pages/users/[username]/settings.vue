<template>
  <UsersSettingsModal :routeAfterClose="routeAfterClose" />
</template>
<script setup lang="ts">
definePageMeta({
  scrollToTop: false
})

const { params } = useRoute()

const routeAfterClose = computed(() => `/users/${params.username}`)
</script>