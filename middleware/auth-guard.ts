export default defineNuxtRouteMiddleware(async (to, from) => {
  const { loggedIn } = useUserSession()
  if (!loggedIn.value && to.path !== '/login') {
    return navigateTo('/login')
  }
})