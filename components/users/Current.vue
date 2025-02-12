<template>
  <div class="h-[100dvh] flex flex-col">
    <UCard class="mb-5">
      <template #header>
        <h1>Your profile</h1>
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

        <UInput
          type="file"
          size="sm"
          icon="i-heroicons-folder"
          @input="handleFileInput"
        />
        <template v-if="files[0] && files[0].content">
          <UAvatar
            :src="files[0].content.toString()"
            size="3xl"
            img-class="object-cover"
          />
          <UButton @click="handleUploadAvatar">upload avatar</UButton>
        </template>

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

const { handleFileInput, files } = useFileStorage()

const handleUploadAvatar = async () => {
  try {
    await $fetch(`/api/users/${data.id}/avatar/upload`, {
      method: 'POST',
      body: {
        file: files.value[0]
      }
    })
  }
  catch (err) {
    console.log(err)
  }
}
</script>