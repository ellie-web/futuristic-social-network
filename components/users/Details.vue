<template>
  <div class="h-[100dvh] flex flex-col">
    <UCard class="mb-5">
      <template #header>
        <div class="flex items-center">
          <UAvatar
            icon="i-heroicons-photo"
            :src="data.avatarUrl"
          />
          <div class="ml-4">
            {{ data.name }}
          </div>
        </div>
      </template>
    </UCard>
    <div class="relative flex-1">
      <PostsFeed :userId="data.id" />
    </div>
  </div>
</template>
<script setup lang="ts">
import type IUser from '~/types/User'

type TProps = {
  data: Omit<IUser, 'password'>
}
const { data } = defineProps<TProps>()
</script>