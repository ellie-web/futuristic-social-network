<template>
  <UCard class="mb-5">
    <template #header>
      <div class="flex items-center">
        <Avatar :user="data" />
        <h1 class="ml-4">
          {{ data.name }}
        </h1>
      </div>
    </template>
  </UCard>
  <div class="relative flex-1">
    <PostsFeed :userId="data.id" />
  </div>
</template>
<script setup lang="ts">
import type IUser from '~/types/user'

type TProps = {
  data: Omit<IUser, 'password'>
}
const { data } = defineProps<TProps>()
</script>