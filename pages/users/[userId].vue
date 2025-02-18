<template>
  <div>
    <template v-if="data">
      <div class="relative grid grid-cols-12 gap-5">
        <div class="sticky top-12 col-span-3 max-h-fit">
          <UsersCurrent
            v-if="user && data.id === user.id"
            :data="data"
          />
          <UsersDetails
            v-else
            :data="data"
          />
        </div>

        <div class="relative flex-1 col-span-9">
          <PostsFeed :userId="data.id" />
        </div>
      </div>
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