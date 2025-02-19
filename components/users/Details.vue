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
      <div class="flex items-center justify-center gap-5">
        <div class="flex flex-col items-center">
          <p>{{ userContext?.followers }}</p>
          <p>followers</p>
        </div>
        <div class="flex flex-col items-center">
          <p>{{ userContext?.following }}</p>
          <p>following</p>
        </div>
      </div>
    </template>
  </UCard>
</template>
<script setup lang="ts">
const { userContext } = useUserContext()
</script>