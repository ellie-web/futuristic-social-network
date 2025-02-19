<template>
  <UCard>
    <template #header>
      <h1>Your profile</h1>
      <div class="flex items-center mb-7">
        <Avatar :user="data" />
        <h1 class="ml-4">
          {{ data.name }}
        </h1>
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