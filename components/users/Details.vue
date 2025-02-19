<template>
  <UCard>
    <template #header>
      <div class="flex items-center mb-7">
        <Avatar
          v-if="userContext"
          :user="userContext"
        />
        <div class="ml-4">
          <h1>
            {{ userContext?.name }}
          </h1>

          <FollowUnfollowButton
            v-if="userContext"
            :id="userContext.id"
            class="mt-2"
          />
        </div>

      </div>
      <div class="flex items-center justify-center gap-5 mb-4">
        <div class="flex flex-col items-center">
          <p>{{ userContext?.followers }}</p>
          <p>followers</p>
        </div>
        <div class="flex flex-col items-center">
          <p>{{ userContext?.following }}</p>
          <p>following</p>
        </div>
      </div>
      <div class="text-gray-500">{{ followStatus }}</div>
    </template>
  </UCard>
</template>
<script setup lang="ts">
import useSWRV from 'swrv';

const { userContext } = useUserContext()

const fetchCheck = () => $fetch(`/api/users/${userContext?.value.id}/follow/check`)

const { data: subscriptionStatus } = useSWRV(`follow/check/${userContext?.value.id}`, fetchCheck)

const followStatus = computed(() => {
  if (!subscriptionStatus.value) return undefined
  if (subscriptionStatus.value.isFollowing && subscriptionStatus.value.isBeingFollowed) {
    return 'You follow each other'
  }
  if (subscriptionStatus.value.isBeingFollowed) {
    return 'Follows you'
  }
})
</script>