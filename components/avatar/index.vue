<template>
  <div>
    <AvatarEdit v-if="isCurrentUser" />

    <UAvatar
      v-else
      :src="avatarUrl"
      icon="i-heroicons-photo"
      size="3xl"
      img-class="object-cover"
    />
  </div>
</template>
<script setup lang="ts">
import type TUserPublic from '~/types/user'

const { user } = defineProps<{ user: TUserPublic }>()

const userStore = useUserStore()
const { user: currentUser } = storeToRefs(userStore)

const avatarUrl = computed(() => user.avatarUrl ? `/api/files?fileName=${user.avatarUrl}` : undefined)
const isCurrentUser = computed(() => user.id === currentUser.value?.id)
</script>