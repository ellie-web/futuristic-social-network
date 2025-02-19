<template>
  <div>
    <template v-if="subscriptionStatus">
      <UButton
        v-if="!subscriptionStatus.isFollowing"
        type="button"
        @click.stop.prevent="handleFollow"
        :loading="isFollowLoading"
        :size="small ? 'xs' : 'md'"
      >
        Follow
      </UButton>
      <UButton
        v-else-if="!hideIfFollowing"
        type="button"
        @click.stop.prevent="handleUnfollow"
        :loading="isFollowLoading"
        variant="outline"
        :size="small ? 'xs' : 'md'"
      >
        Unfollow
      </UButton>
    </template>
  </div>
</template>
<script setup lang="ts">
import useSWRV from 'swrv'

type TProps = {
  id: number,
  small?: boolean,
  hideIfFollowing?: boolean
}

const { id, small, hideIfFollowing } = defineProps<TProps>()
const emit = defineEmits(['follow', 'unfollow'])

const fetchCheck = () => $fetch(`/api/users/${id}/follow/check`)

const { data: subscriptionStatus, mutate } = useSWRV(`follow/check/${id}`, fetchCheck)

const isFollowLoading = ref()

const toast = useToast()
const { showError } = useErrorToast()

const { userContext } = useUserContext()

const handleFollow = async () => {
  isFollowLoading.value = true
  try {
    const followedName = await $fetch(`/api/users/${id}/follow`, {
      method: 'POST'
    })

    if (userContext?.value) {
      userContext.value.followers += 1
    }

    // const _subscriptionStatus = await fetchCheck()
    await mutate(async () => await fetchCheck())
    toast.add({
      description: `You now follow ${userContext?.value?.name || followedName}!`
    })
  }
  catch (err) {
    console.log(err)
    showError({ message: 'Error following the user' })
  }
  isFollowLoading.value = false
  emit('follow')
}

const handleUnfollow = async () => {
  isFollowLoading.value = true
  try {
    const unfollowedName = await $fetch(`/api/users/${id}/follow`, {
      method: 'DELETE'
    })

    if (userContext?.value) {
      console.log(userContext.value)
      userContext.value.followers -= 1
    }

    await mutate(async () => await fetchCheck())
    toast.add({
      description: `You no longer follow ${userContext?.value?.name || unfollowedName}`
    })
  }
  catch (err) {
    console.log(err)
    showError({ message: 'Error unfollowing the user' })
  }
  isFollowLoading.value = false
  emit('unfollow')
}

</script>