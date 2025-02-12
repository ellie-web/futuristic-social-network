<template>
  <template v-if="data">
    <div class="h-[100dvh] flex flex-col">
      <UCard class="mb-5">
        <template #header>
          <div class="flex items-center">
            <UAvatar icon="i-heroicons-photo" />
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
  <template v-if="error">
    {{ error }}
  </template>
</template>
<script setup lang="ts">
const { params } = useRoute()
const { data, error } = await useFetch(`/api/users/${params.id}`)
</script>