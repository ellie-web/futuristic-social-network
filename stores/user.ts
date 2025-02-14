export const useUserStore = defineStore('user', () => {
  const { loggedIn, session, fetch: fetchSession, clear, openInPopup } = useUserSession()
  const { data: user, refresh } = useFetch(`/api/users/current`)

  const refreshUser = refresh

  const login = async (data: {email: string, password: string}) => {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: data
    })

    // refresh the session status now that the user is logged in
    await fetchSession()

    await refreshUser()
    await navigateTo('/')
  }

  const logout = async () => {
    try {
      await $fetch('/api/auth/logout', {
        method: 'POST'
      })
    }
    catch (err) {
      console.log(err)
    }
    // refresh the session status now that the user is logged out
    await fetchSession()
    await navigateTo('/login')
  }

  return {
    loggedIn,
    session,
    fetchSession,
    clear,
    openInPopup,
    user,
    refreshUser,
    login,
    logout
  }
})