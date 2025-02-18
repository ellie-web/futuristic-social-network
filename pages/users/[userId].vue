<template>
  <div>
    <template v-if="data">
      <UsersCurrent
        v-if="user && data.id === user.id"
        :data="data"
      />
      <UsersDetails
        v-else
        :data="data"
      />
    </template>
    <div v-if="error">
      {{ error }}
    </div>

    <Transition v-bind="transitionConfig">
      <NuxtPage />
    </Transition>
  </div>
</template>
<script setup lang="ts">
import type IUser from '~/types/user'
import transitionConfig from '~/helpers/transitionsConfig'

const { user } = useUserSession()
const { params } = useRoute()
const { data, error } = await useFetch<Omit<IUser, 'password'>>(`/api/users/${params.userId}`)
</script>