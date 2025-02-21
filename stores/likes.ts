export const useLikesStore = defineStore('likes', () => {
  const likes = reactive(new Map<number, boolean>())

  const clearLikes = () => likes.clear()

  return {
    likes,
    clearLikes
  }
})