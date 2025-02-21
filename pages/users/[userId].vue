<template>
  <div>
    <template v-if="data">
      <div class="relative grid grid-cols-12 gap-5">
        <div class="sticky top-12 col-span-3 max-h-fit">
          <UsersCurrent
            v-if="userContext && (user && userContext.id === user.id)"
            :data="userContext"
          />
          <UsersDetails
            v-else
            :data="data"
          />
        </div>

        <div
          class="relative flex-1 col-span-9"
          v-if="data"
        >
          <PostsFeed :userId="data.id" />
        </div>
      </div>
    </template>

    <div v-if="error">
      {{ error }}
    </div>

    <Transition v-bind="transitionConfig">
      <NuxtPage />
    </Transition>
  </div>
</template>
<script setup lang="ts">
import type { TUserContext, TUserPublic } from '~/types/user'
import transitionConfig from '~/helpers/transitionsConfig'

const { user } = useUserSession()
const { params } = useRoute()
const { data, error } = await useFetch<TUserPublic>(`/api/users/${params.userId}`)

const postsStore = usePostsStore()

const _followersRef = ref(data.value?.followers)
const _followingRef = ref(data.value?.following)

const followers = computed({
  get() {
    return _followersRef.value
  },
  set(value) {
    _followersRef.value = value
  }
})

const following = computed({
  get() {
    return _followingRef.value
  },
  set(value) {
    _followingRef.value = value
  }
})

const userContext = ref<TUserContext | null>(data.value ? Object.assign(data.value, { following, followers }) : null)
provideUserContext(userContext)

const setUserContext = () => {
  if (!data.value) return

  followers.value = data.value.followers
  following.value = data.value.following
  userContext.value = Object.assign(data.value, { following, followers })
}

onMounted(() => {
  postsStore.posts = []
  setUserContext()
})

watch(data, () => {
  setUserContext()
})
</script>