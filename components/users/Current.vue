<template>
  <UCard>
    <template #header>
      <h1>Your profile</h1>
      <div class="flex items-center">
        <Avatar :user="data" />
        <h1 class="ml-4">
          {{ data.name }}
        </h1>
      </div>
    </template>
    <PostsCreate />
  </UCard>
</template>
<script setup lang="ts">
import type IUser from '~/types/user'

type TProps = {
  data: Omit<IUser, 'password'>
}
const { data } = defineProps<TProps>()
</script>