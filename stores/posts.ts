import type { IFeedPost } from '~/types/feed'
import type { IPost } from '~/types/post'

export const usePostsStore = defineStore('posts', () => {
  const posts = ref<IFeedPost[]>([])

  const getPostById = computed(() => async (id: number): Promise<IFeedPost | undefined> => {
    try {
      const _post = posts.value.find((post: IFeedPost) => post.id === id)
      if (_post) {
        return Promise.resolve(_post)
      }
      else {
        return await $fetch<IPost>(`/api/posts/${id}`)
      }
    }
    catch(err) {
      throw err
    }
  })

  const updatePostById = (id: number, data: Partial<IFeedPost>) => {
    try {
      let _post = posts.value.find((post: IFeedPost) => post.id === id)
      if (_post) {
        _post = Object.assign(_post, data)
      }
    }
    catch(err) {
      throw err
    }
  }

  return {
    posts,
    getPostById,
    updatePostById
  }
})
