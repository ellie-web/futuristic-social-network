<template>
  <div>
    <h1>home</h1>
    <div v-if="user">Welcome, {{ user }}!</div>
    <div>
      <ULink to="/login">Login</ULink>
      <ULink to="/register">Register</ULink>
      <UButton @click="logout">Logout</UButton>
    </div>

    <div>
      <PostsCreate />
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

const { loggedIn, user, session, fetch, clear, openInPopup } = useUserSession()

const logout = async () => {
  try {
    await $fetch('/api/auth/logout', {
      method: 'POST'
    })
  }
  catch (err) {
    console.log(err)
  }
  // refresh the session status now that the user is logged in
  const { fetch } = useUserSession()
  await fetch()
  await navigateTo('/login')
}
</script>