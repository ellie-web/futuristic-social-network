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
import type IUser from '~/types/user'

type TProps = {
  user: Omit<IUser, 'password'>
}

const { user } = defineProps<TProps>()

const userStore = useUserStore()
const { user: currentUser } = storeToRefs(userStore)

const avatarUrl = computed(() => user.avatarUrl ? `/api/files?fileName=${user.avatarUrl}` : undefined)
const isCurrentUser = computed(() => user.id === currentUser.value?.id)
</script>