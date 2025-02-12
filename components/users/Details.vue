<template>
  <div class="h-[100dvh] flex flex-col">
    <UCard class="mb-5">
      <template #header>
        <div class="flex items-center">
          <UAvatar
            :src="avatarUrl"
            icon="i-heroicons-photo"
            size="3xl"
            img-class="object-cover"
          />
          <h1 class="ml-4">
            {{ data.name }}
          </h1>
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
const avatarUrl = computed(() => data.avatarUrl ? `/api/files?fileName=${data.avatarUrl}` : undefined)
</script>