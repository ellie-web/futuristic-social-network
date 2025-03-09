<template>
  <UCard>
    <template #header>
      <div class="mb-4">
        <Avatar :user="data" />
      </div>
      <div class="gap-y-4 mb-7">
        <h1>
          {{ data.name }}
        </h1>
        <p class="text-gray-400 mb-2">@{{ data.username }}</p>

        <p>{{ data.bio }}</p>
      </div>


      <div class="mb-7">
        <UButton :to="`/users/${data.username}/settings`">Edit profile</UButton>
      </div>

      <div class="flex items-center justify-center gap-5">
        <div class="flex flex-col items-center">
          <p>{{ data.followers }}</p>
          <p>followers</p>
        </div>
        <div class="flex flex-col items-center">
          <p>{{ data.following }}</p>
          <p>following</p>
        </div>
      </div>
    </template>
    <PostsCreate />
  </UCard>
</template>
<script setup lang="ts">
import type TUserPublic from '~/types/user'

type TProps = {
  data: TUserPublic
}
const { data } = defineProps<TProps>()
</script>