<template>
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
</template>
<script setup lang="ts">
const { user } = useUserSession()
const { params } = useRoute()
const { data, error } = await useFetch(`/api/users/${params.id}`)
</script>